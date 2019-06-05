"""Modulo que cuida das conexoes de bancos de dados"""


import cx_Oracle


class ConnectionFactory():
    """Classe reponsavel pela geracao de conexoes com bancos de dados"""

    def __init__(self):
        self.__ORACLE = 1

    def get_connection(self, database):
        database_connection = None

        if database == self.__ORACLE:
            database_user = "wecash"
            database_password = "wecash"
            database_connection_string = "claudio-acioli:1521/orcl"
            database_connection = cx_Oracle.connect(database_user, database_password, database_connection_string)

        return database_connection

    def make_dict_factory(cursor):
        columnNames = [d[0] for d in cursor.description]

        def create_row(*args):
            return dict(zip(columnNames, args))

        return create_row