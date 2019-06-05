"""Modulo que define objeto Movimento"""


class Movimento():

    def __init__(self):
        self._id = 0
        self._conta = None
        self._categoria = None
        self._historico = None
        self._previsao = None
        self._confirmacao = None
        self._valor = 0.0

    def set_id(self, id):
        self._id = int(id)

    def get_id(self):
        return self._id

    def set_conta(self, conta):
        self._conta = conta

    def get_conta(self):
        return self._conta

    def set_categoria(self, categoria):
        self._categoria = categoria

    def get_categoria(self):
        return self._categoria

    def set_historico(self, historico):
        self._historico = historico

    def get_historico(self):
        if self._historico:
            return self._historico.capitalize()
        return None

    def set_previsao(self, previsao):
        self._previsao = previsao

    def get_previsao(self):
        return self._previsao

    def set_confirmacao(self, confirmacao):
        self._confirmacao = confirmacao

    def get_confirmacao(self):
        return self._confirmacao

    def set_valor(self, valor):
        self._valor = valor

    def get_valor(self):
        return self._valor

    def to_dict(self):
        return {
            "id_movimento": self.id,
            "ds_historico": self.historico,
            "dt_previsao": self.previsao,
            "dt_confirmacao": self.confirmacao,
            "vl_movimento": '{:.2f}'.format(float(self.valor)),
            "id_categoria": self.categoria.id,
            "ds_categoria": self.categoria.descricao,
            "tp_categoria": self.categoria.tipo,
            "id_conta": self.conta.id,
            "ds_conta": self.conta.descricao
        }

    id = property(get_id, set_id)
    conta = property(get_conta, set_conta)
    categoria = property(get_categoria, set_categoria)
    historico = property(get_historico, set_historico)
    previsao = property(get_previsao, set_previsao)
    confirmacao = property(get_confirmacao, set_confirmacao)
    valor = property(get_valor, set_valor)

