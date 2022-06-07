const knex = require('../database/connection');
const registerChargeSchema = require('../validations/registerChargeSchema');

const registerCharge = async (req, res) => {
    const { id, cliente, descricao, status, valor, vencimento } = req.body;

    const bodyFormatted = {
        cliente: cliente.trim(), descricao: descricao.trim(), status,
        valor: valor.trim(), vencimento: vencimento.trim()
    };

    try {
        await registerChargeSchema.validate(bodyFormatted);

        const clientExists = await knex('clientes').where({ id }).first();

        if (!clientExists) {
            return res.status(400).json("O cliente informado não existe");
        };

        const charge = await knex('cobrancas')
            .insert({
                cliente,
                id_cliente: id,
                descricao,
                status,
                valor,
                vencimento
            })
            .returning('*');

        if (!charge) {
            return res.status(400).json("O cadastro não foi concluído");
        };

        const clientStatus = await knex('clientes')
            .where({ id })
            .update({
                condicao: status
            });

        return res.status(200).json("Cobrança cadastrada com sucesso");
    } catch (error) {
        return res.status(500).json(error.message);
    };
};

const getCharges = async (req, res) => {
    try {
        let charges = await knex('cobrancas');

        for (let charge of charges) {
            if (charge.status === true) {
                charge.status = (charge.status.toString().replace(true, "Pago"));
            } else if (charge.status === false && charge.vencimento < new Date()) {
                charge.status = (charge.status.toString().replace(false, "Vencido"));
            } else {
                charge.status = (charge.status.toString().replace(false, "Pendente"));
            };
        };

        return res.status(200).json(charges);
    } catch (error) {
        return res.status(500).json(error.message);
    };
};

module.exports = {
    registerCharge,
    getCharges
};