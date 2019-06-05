"""Modulo que manipula os dados referentes a categoria no Oracle"""

import cx_Oracle
from data.factory import ConnectionFactory
from data.categoria import Categoria


class CategoriaDAO:

    def __init__(self):
        self.__database_connection = ConnectionFactory().get_connection(1)

    def get_categorias(self):
        """Retorna lista de categorias por empresa"""

        database_statement = \
            'SELECT ID_EMPRESA, ID_CATEGORIA, DS_CATEGORIA, TP_CATEGORIA ' \
            '  FROM TB_CATEGORIA ' \
            ' WHERE ID_EMPRESA = :EMPRESA '

        database_cursor = self.__database_connection.cursor()
        database_cursor.execute(database_statement, {'EMPRESA':1})
        database_resultset = database_cursor.fetchall()

        database_results = []
        for database_row in database_resultset:
            categoria = Categoria()
            categoria.id = database_row[1]
            categoria.descricao = database_row[2]
            categoria.tipo = database_row[3]
            database_results.append(categoria)

        return database_results

    def get_categoria(self, id):
        """Retorna categoria especifica por id"""

        database_statement = \
            'SELECT ID_EMPRESA, ID_CATEGORIA, DS_CATEGORIA, TP_CATEGORIA ' \
            '  FROM TB_CATEGORIA ' \
            ' WHERE ID_EMPRESA = :EMPRESA' \
            '   AND ID_CATEGORIA = :ID '

        database_cursor = self.__database_connection.cursor()
        database_cursor.execute(database_statement, {'EMPRESA': 1, 'ID': id})
        database_resultset = database_cursor.fetchone()

        if database_resultset:
            categoria = Categoria()
            categoria.id = database_resultset[1]
            categoria.descricao = database_resultset[2]
            categoria.tipo = database_resultset[3]
            return categoria

        return None

    def create_categoria(self, categoria):
        """Cria categoria a partir de objeto categoria"""

        database_statement = \
            'INSERT INTO TB_CATEGORIA(ID_CATEGORIA, DS_CATEGORIA, ID_EMPRESA, TP_CATEGORIA) ' \
            'VALUES (SQ_CATEGORIA.NEXTVAL, :1, :2, :3)' \
            'RETURNING ID_CATEGORIA INTO :4 '

        database_cursor = self.__database_connection.cursor()
        database_id = database_cursor.var(cx_Oracle.NUMBER)
        database_cursor.execute(database_statement, (categoria.descricao, 1, categoria.tipo, database_id))
        self.__database_connection.commit()

        return database_id.getvalue()[0]

    def update_categoria(self, categoria):
        """Altera categoria a partir de objeto categoria"""

        database_statement = \
            'UPDATE TB_CATEGORIA ' \
            '   SET DS_CATEGORIA = :1 ' \
            '      ,TP_CATEGORIA = :2' \
            ' WHERE ID_CATEGORIA = :3' \
            '   AND ID_EMPRESA = :4 '

        database_cursor = self.__database_connection.cursor()
        database_cursor.execute(database_statement, (categoria.descricao, categoria.tipo, categoria.id, 1))
        self.__database_connection.commit()

        return database_cursor.rowcount

    def delete_categoria(self, categoria):
        """Excluir categoria a partir de objeto categoria"""

        database_statement = 'DELETE FROM TB_CATEGORIA WHERE ID_CATEGORIA = :1 AND ID_EMPRESA = :2 '
        database_cursor = self.__database_connection.cursor()
        database_cursor.execute(database_statement, (categoria.id, 1))
        self.__database_connection.commit()

        return database_cursor.rowcount

    def consulta_por_categoria(self, id_empresa, tp_categoria, dt_referencia):
        """Retorna compromissos por categoria"""

        database_results = []
        database_statement = """
        select m.id_categoria,
               max(c.ds_categoria) ds_categoria,
               sum(m.nr_valor_previsto) vl_total,
               round(ratio_to_report(sum(decode(m.id_categoria, null, 0, m.nr_valor_previsto))) over ()*100 ,2) as porcentagem
          from tb_movimento m,
               tb_categoria c
         where c.id_categoria = m.id_categoria
           and c.id_empresa = :empresa
           and c.tp_categoria = :tipo
           and (
               to_char(dt_confirmacao,'mm/yyyy') = :referencia
               or (dt_confirmacao is  null
                   and to_date(to_char(dt_previsao,'mm/yyyy'),'mm/yyyy') < to_date(:referencia,'mm/yyyy')
                   and to_date(:referencia,'mm/yyyy') <= to_date(to_char(sysdate,'mm/yyyy'),'mm/yyyy')
               )
               or to_char(dt_confirmacao,'mm/yyyy') = :referencia
           )
         group by m.id_categoria
         order by sum(m.nr_valor_previsto) desc
        """

        database_cursor = self.__database_connection.cursor()
        database_cursor.execute(database_statement, {'empresa': id_empresa, 'tipo': tp_categoria, 'referencia':dt_referencia})
        database_resultset = database_cursor.fetchall()


        for database_row in database_resultset:
            database_results.append({
                'id_categoria':database_row[0],'ds_categoria':database_row[1],'vl_total':database_row[2],'vl_porcentagem':database_row[3]
            })

        return database_results
