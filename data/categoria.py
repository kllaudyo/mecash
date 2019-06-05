"""Modulo que define objeto Categoria"""


class Categoria():

    def __init__(self):
        self._id = 0
        self._descricao = None
        self._tipo = None

    def set_id(self, id):
        self._id = int(id)

    def set_descricao(self, descricao):
        self._descricao = descricao

    def set_tipo(self, tipo):
        self._tipo = tipo

    def get_id(self):
        return self._id

    def get_descricao(self):
        if self._descricao:
            return self._descricao.capitalize()
        return None

    def get_tipo(self):
        return self._tipo

    def to_dict(self):
        return {
            "id_categoria": self.id,
            "ds_categoria": self.descricao,
            "tp_categoria": self.tipo
        }

    id = property(get_id, set_id)
    descricao = property(get_descricao, set_descricao)
    tipo = property(get_tipo, set_tipo)


