"""Modulo que manipula os dados referentes a movimentos no Oracle"""

import cx_Oracle
from data.factory import ConnectionFactory
from data.categoria import Categoria
from data.conta import Conta
from data.movimento import Movimento


class MovimentoDAO:

    def __init__(self):
        self.__database_connection = ConnectionFactory().get_connection(1)

    def get_movimentos(self, referente):
        """Retorna lista de movimentos por empresa e por referencia"""

        database_statement = \
            'select c.id_caixa, ' \
            '       c.ds_caixa, ' \
            '       t.id_categoria, ' \
            '       t.ds_categoria, ' \
            '       t.tp_categoria, ' \
            '       m.id_Movimento, ' \
            '       m.ds_historico, ' \
            '       to_char(m.dt_previsao,\'YYYY-MM-DD\') dt_previsao, ' \
            '       to_char(m.dt_confirmacao,\'YYYY-MM-DD\') dt_confirmacao, ' \
            '       m.nr_valor_previsto ' \
            '  from tb_movimento m, ' \
            '       tb_caixa c, ' \
            '       tb_categoria t ' \
            ' where c.id_caixa = m.id_caixa ' \
            '   and t.id_categoria = m.id_categoria ' \
            '   and c.id_empresa = :empresa ' \
            '   and (to_char(dt_previsao,\'MM/YYYY\') = :referente ' \
            '        or (dt_confirmacao is null ' \
            '       and to_date(to_char(dt_previsao,\'MM/YYYY\'),\'MM/YYYY\') < to_date(:referente,\'MM/YYYY\')  ' \
            '       and to_date(:referente,\'MM/YYYY\') <= to_date(to_char(sysdate,\'MM/YYYY\'),\'MM/YYYY\')  ) ' \
            '        or to_char(dt_confirmacao,\'MM/YYYY\') = :referente ' \
            '   ) ' \
            ' order by m.dt_confirmacao desc, m.dt_previsao '

        database_cursor = self.__database_connection.cursor()
        database_cursor.execute(database_statement, {'empresa':1,'referente':referente})
        database_resultset = database_cursor.fetchall()

        database_results = []
        for database_row in database_resultset:
            movimento = Movimento()
            movimento.conta = Conta()
            movimento.categoria = Categoria()
            movimento.conta.id = database_row[0]
            movimento.conta.descricao = database_row[1]
            movimento.categoria.id = database_row[2]
            movimento.categoria.descricao = database_row[3]
            movimento.categoria.tipo = database_row[4]
            movimento.id = database_row[5]
            movimento.historico = database_row[6]
            movimento.previsao = database_row[7]
            movimento.confirmacao = database_row[8]
            movimento.valor = database_row[9]
            database_results.append(movimento)

        return database_results

    def get_movimento(self, id):
        """Retorna movimento por id"""

        database_statement = \
            'select c.id_caixa, ' \
            '       c.ds_caixa, ' \
            '       t.id_categoria, ' \
            '       t.ds_categoria, ' \
            '       t.tp_categoria, ' \
            '       m.id_Movimento, ' \
            '       m.ds_historico, ' \
            '       to_char(m.dt_previsao,\'YYYY-MM-DD\') dt_previsao, ' \
            '       to_char(m.dt_confirmacao,\'YYYY-MM-DD\') dt_confirmacao, ' \
            '       m.nr_valor_previsto ' \
            '  from tb_movimento m, ' \
            '       tb_caixa c, ' \
            '       tb_categoria t ' \
            ' where c.id_caixa = m.id_caixa ' \
            '   and t.id_categoria = m.id_categoria ' \
            '   and c.id_empresa = :empresa ' \
            '   and m.id_movimento = :id ' \
            ' order by m.dt_confirmacao desc, m.dt_previsao '

        database_cursor = self.__database_connection.cursor()
        database_cursor.execute(database_statement, {'empresa':1,'id':id})
        database_resultset = database_cursor.fetchone()

        if database_resultset:
            movimento = Movimento()
            movimento.conta = Conta()
            movimento.categoria = Categoria()
            movimento.conta.id = database_resultset[0]
            movimento.conta.descricao = database_resultset[1]
            movimento.categoria.id = database_resultset[2]
            movimento.categoria.descricao = database_resultset[3]
            movimento.categoria.tipo = database_resultset[4]
            movimento.id = database_resultset[5]
            movimento.historico = database_resultset[6]
            movimento.previsao = database_resultset[7]
            movimento.confirmacao = database_resultset[8]
            movimento.valor = database_resultset[9]
            return movimento

        return None

    def create_movimento(self, movimento):

        database_statement = \
            'INSERT INTO TB_MOVIMENTO(ID_MOVIMENTO, ID_CAIXA, ID_CATEGORIA, DS_HISTORICO, DT_PREVISAO, DT_CONFIRMACAO, TP_MOVIMENTO, NR_VALOR_PREVISTO) ' \
            ' VALUES (SQ_MOVIMENTO.NEXTVAL,:1,:2,:3,:4,:5,:6,:7)' \
            ' RETURNING ID_MOVIMENTO INTO :8 '

        database_cursor = self.__database_connection.cursor()
        database_id = database_cursor.var(cx_Oracle.NUMBER)
        database_cursor.execute(database_statement, (
            movimento.conta.id,
            movimento.categoria.id,
            movimento.historico,
            movimento.previsao,
            movimento.confirmacao,
            'V',
            str(movimento.valor).replace('.',','),
            database_id)
        )
        self.__database_connection.commit()

        return database_id.getvalue()[0]

    def update_movimento(self, movimento):

        database_statement = \
            ' UPDATE TB_MOVIMENTO ' \
            '    SET ID_CATEGORIA = :1 ' \
            '       ,ID_CAIXA = :2' \
            '       ,DS_HISTORICO = :3 ' \
            '       ,DT_PREVISAO = :4 ' \
            '       ,DT_CONFIRMACAO = :5' \
            '       ,NR_VALOR_PREVISTO = :6 ' \
            '  WHERE ID_MOVIMENTO = :7 '

        database_cursor = self.__database_connection.cursor()
        database_cursor.execute(database_statement, (
            movimento.categoria.id,
            movimento.conta.id,
            movimento.historico,
            movimento.previsao,
            movimento.confirmacao,
            str(movimento.valor).replace('.',','),
            movimento.id
        ))

        self.__database_connection.commit()
        return database_cursor.rowcount

    def delete_movimento(self, movimento):

        database_statement = 'DELETE FROM TB_MOVIMENTO WHERE ID_MOVIMENTO = :ID '
        database_cursor = self.__database_connection.cursor()
        database_cursor.execute(database_statement, {'ID':movimento.id})
        self.__database_connection.commit()

        return database_cursor.rowcount

    def consulta_por_categoria(self, id_categoria, dt_referencia):
        """Retorna movimentos por categoria e referencia informadas"""

        database_results = []
        database_statement = """
        select max(m.ds_historico) historico, 													
               to_char(sum(m.nr_valor_previsto),'9G999G999G990D00') valor_br, 						
               round( ratio_to_report(sum(m.nr_valor_previsto)) over ()*100 ,2) as porcentagem 	
          from tb_movimento m, 																	
               tb_categoria t 																	
         where t.id_categoria = m.id_categoria 														
           and ( to_char(dt_confirmacao,'mm/yyyy') = :referencia 								
                   or (dt_confirmacao is  null 														
                   and to_date(to_char(dt_previsao,'mm/yyyy'),'mm/yyyy') < to_date(:referencia,'mm/yyyy') 
                   and to_date(:referencia,'mm/yyyy') <= to_date(to_char(sysdate,'mm/yyyy'),'mm/yyyy') ) 
                   or to_char(dt_confirmacao,'mm/yyyy') = :referencia ) 						
            and dt_confirmacao is not null 																	
            and t.id_categoria = :categoria										
          group by trim(upper(ds_historico)) 																	
          order by porcentagem desc         
        """

        database_cursor = self.__database_connection.cursor()
        database_cursor.execute(database_statement, {'categoria':id_categoria,'referencia':dt_referencia})
        database_resultset = database_cursor.fetchall()

        for database_row in database_resultset:
            database_results.append({
                'ds_historico': database_row[0], 'vl_total': database_row[1], 'vl_porcentagem': database_row[2]
            })

        return database_results