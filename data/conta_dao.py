"""Modulo que manipula os dados referentes a conta no Oracle"""

import cx_Oracle
from data.conta import Conta
from data.factory import ConnectionFactory


class ContaDAO:

    def __init__(self):
        self.__database_connection = ConnectionFactory().get_connection(1)

    def get_contas(self):
        """Retorna lista de contas por empresa"""

        database_statement = \
            'SELECT ID_CAIXA, DS_CAIXA, (' \
                'SELECT NVL(SUM(DECODE(T.TP_CATEGORIA,\'C\', M.NR_VALOR_PREVISTO,0)) - SUM(DECODE(T.TP_CATEGORIA,\'D\', M.NR_VALOR_PREVISTO,0)),0) SALDO '\
                '  FROM TB_MOVIMENTO M, TB_CATEGORIA T ' \
                ' WHERE M.ID_CAIXA = C.ID_CAIXA ' \
                '   AND M.ID_CATEGORIA = T.ID_CATEGORIA ' \
                '   AND DT_CONFIRMACAO IS NOT NULL ' \
            ') NR_SALDO_INICIAL ' \
            '  FROM TB_CAIXA C' \
            ' WHERE ID_EMPRESA = :EMPRESA' \
            '   AND CS_CARTAO = \'0\' '


        database_cursor = self.__database_connection.cursor()
        database_cursor.execute(database_statement, {'EMPRESA':1})
        database_resultset = database_cursor.fetchall()

        database_results = []
        for database_row in database_resultset:
            conta = Conta()
            conta.id = database_row[0]
            conta.descricao = database_row[1]
            conta.valor = database_row[2]
            database_results.append(conta)

        return database_results

    def get_conta(self, id):
        """Retorna conta especifica por id"""

        database_statement = \
            'SELECT ID_CAIXA, DS_CAIXA, NR_SALDO_INICIAL ' \
            '  FROM TB_CAIXA ' \
            ' WHERE ID_EMPRESA = :EMPRESA ' \
            '   AND ID_CAIXA = :ID ' \
            '   AND CS_CARTAO = \'0\' '

        database_cursor = self.__database_connection.cursor()
        database_cursor.execute(database_statement, {'EMPRESA': 1, 'ID': id})
        database_resultset = database_cursor.fetchone()

        if database_resultset:
            conta = Conta()
            conta.id = database_resultset[0]
            conta.descricao = database_resultset[1]
            conta.valor = database_resultset[2]
            return conta

        return None

    def create_conta(self, conta):
        """Cria conta a partir de objeto conta"""
        database_statement = \
            'INSERT INTO TB_CAIXA(ID_EMPRESA, ID_CAIXA, DS_CAIXA, NR_SALDO_INICIAL, DT_SALDO) ' \
            'VALUES (:1, SQ_CAIXA.nextval, :2, :3, SYSDATE) RETURNING ID_CAIXA INTO :4'

        database_cursor = self.__database_connection.cursor()
        database_id = database_cursor.var(cx_Oracle.NUMBER)
        database_cursor.execute(database_statement, (1, conta.descricao, str(conta.valor).replace('.',','), database_id))
        self.__database_connection.commit()

        return database_id.getvalue()[0]

    def update_conta(self, conta):
        """Altera conta a partir de objeto conta"""

        database_statement = \
            'UPDATE TB_CAIXA ' \
            '   SET DS_CAIXA = :1 ' \
            '      ,NR_SALDO_INICIAL = :2 ' \
            ' WHERE ID_CAIXA = :3 ' \
            '   AND ID_EMPRESA = :4 '

        database_cursor = self.__database_connection.cursor()
        database_cursor.execute(database_statement, (conta.descricao, str(conta.valor).replace('.',','), conta.id, 1))
        self.__database_connection.commit()

        return database_cursor.rowcount

    def delete_conta(self, conta):
        """Excluir conta a partir de objeto conta"""

        database_statement = 'DELETE FROM TB_CAIXA WHERE ID_CAIXA = :1 AND ID_EMPRESA = :2 '
        database_cursor = self.__database_connection.cursor()
        database_cursor.execute(database_statement, (conta.id, 1))
        self.__database_connection.commit()

        return database_cursor.rowcount

