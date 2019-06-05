"""Modulo que define objeto Conta"""


class Conta():

    def __init__(self):
        self._id = 0
        self._descricao = None
        self._valor = None

    def set_id(self, id):
        self._id = int(id)

    def set_descricao(self, descricao):
        self._descricao = descricao

    def set_valor(self, valor):
        self._valor = float(valor)

    def get_id(self):
        return self._id

    def get_descricao(self):
        if self._descricao:
            return self._descricao.capitalize()
        return None

    def get_valor(self):
        return self._valor

    def to_dict(self):
        return {
            'id_conta': self.id,
            'ds_conta': self.descricao,
            'vl_saldo': '{:.2f}'.format(float(self.valor))
        }

    id = property(get_id, set_id)
    descricao = property(get_descricao, set_descricao)
    valor = property(get_valor, set_valor)


