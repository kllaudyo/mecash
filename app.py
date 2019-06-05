import re
from datetime import datetime
from flask import Flask, request, jsonify, render_template, redirect
from data.conta import Conta
from data.categoria import Categoria
from data.movimento import Movimento
from data.conta_dao import ContaDAO
from data.categoria_dao import CategoriaDAO
from data.movimento_dao import MovimentoDAO

app = Flask(__name__)


@app.route('/movimentos')
@app.route('/movimentos/')
@app.route('/movimentos/<year>/<month>')
def movimentos(year=None, month=None):
    if re.search('application/json', str(request.accept_mimetypes)) \
            and not re.search('text/html', str(request.accept_mimetypes)) \
            and not len(str(request.accept_mimetypes)) == 0 :
        results = []
        movimentos = MovimentoDAO().get_movimentos(month + '/' + year)
        for movimento in movimentos:
            results.append(movimento.to_dict())

        return jsonify(results)

    else:

        if year is None and month is None:
            data = datetime.now()
            year = data.strftime('%Y')
            month = data.strftime('%m')
            return redirect('/movimentos/'+year+'/'+month, code=302)

        return render_template('movimentos.html',year=year, month=month)


@app.route('/movimento/', methods=['GET','POST'])
@app.route('/movimento/<id>', methods=['GET','POST','PUT','DELETE'])
def movimento(id=0):

    if request.method == 'GET':

        conta = ""
        categoria = ""
        historico = ""
        previsao = ""
        confirmacao = ""
        valor = ""
        if int(id) != 0:
            movimento = MovimentoDAO().get_movimento(id)
            if movimento:
                conta = movimento.conta.id
                categoria = movimento.categoria.id
                historico = movimento.historico
                previsao = movimento.previsao
                confirmacao = movimento.confirmacao
                valor = movimento.valor
            else:
                id = 0

        return render_template('movimento.html',
                               id=id,
                               conta=conta,
                               categoria=categoria,
                               historico=historico,
                               previsao=previsao,
                               confirmacao=confirmacao,
                               valor=valor)

    elif request.method == 'POST':

        movimento = Movimento()
        movimento.conta = Conta()
        movimento.categoria = Categoria()
        movimento.id = request.form['id']
        movimento.conta.id = request.form['conta']
        movimento.categoria.id = request.form['categoria']
        movimento.historico = request.form['historico']
        movimento.previsao = request.form['previsao']
        movimento.confirmacao = request.form['confirmacao']
        movimento.valor = request.form['valor']

        if movimento.id == 0:
            # movimento = MovimentoDAO().get_movimento()
            movimento.id = MovimentoDAO().create_movimento(movimento)
        else:
            MovimentoDAO().update_movimento(movimento)

        return jsonify(movimento.to_dict())

    elif request.method == 'DELETE':

        if id != 0:
            dao = MovimentoDAO()
            movimento = dao.get_movimento(id)
            if movimento:
                result = dao.delete_movimento(movimento)
                if result == 1:
                    return jsonify({'status': 1, 'message': 'Movimento excluído com sucesso', 'payload': {'affectedRows': result}})

        return jsonify({'status': -1, 'message': 'Movimento desconhecida!', 'payload': None})

    elif request.method == 'PUT':

        if id != 0:
            dao = MovimentoDAO()
            movimento = dao.get_movimento(id)
            data = request.get_json(force=True)


            if "is_payed" in data:
                if data["is_payed"] == 1:
                    movimento.confirmacao = datetime.now().strftime('%Y-%m-%d')
                else:
                    movimento.confirmacao = None

                dao.update_movimento(movimento)
                return jsonify(movimento.to_dict())


@app.route('/contas')
@app.route('/contas/')
def contas():
    print(request.accept_mimetypes)
    if re.search('application/json', str(request.accept_mimetypes)) \
            and not re.search('text/html', str(request.accept_mimetypes)) \
            and not len(str(request.accept_mimetypes)) == 0 :
        results = []
        contas = ContaDAO().get_contas()
        for conta in contas:
            results.append(conta.to_dict())
        return jsonify(results)

    else:
        return render_template('contas.html')


@app.route('/conta/', methods=['GET','POST'])
@app.route('/conta/<id>', methods=['GET','POST','DELETE'])
def conta(id=0):

    if request.method == 'GET':
        descricao = ""
        valor = ""
        if int(id) != 0:
            conta = ContaDAO().get_conta(id)
            if conta:
                descricao = conta.descricao
                valor = conta.valor
            else:
                id = 0

        return render_template('conta.html', id=id, descricao=descricao, valor=valor)

    elif request.method == 'POST':

        conta = Conta()
        conta.id = request.form["id"]
        conta.descricao = request.form["descricao"]
        conta.valor = request.form["valor"]

        if conta.id == 0:
            conta.id = ContaDAO().create_conta(conta)
        else:
            ContaDAO().update_conta(conta)

        return jsonify(conta.to_dict())

    elif request.method == 'DELETE':
        if id != 0:
           dao = ContaDAO()
           conta = dao.get_conta(id)
           if conta :
               result = dao.delete_conta(conta)
               if result == 1:
                   return jsonify({'status':1,'message':'Conta excluída com sucesso', 'payload':{'affectedRows':result}})

        return jsonify({'status': -1, 'message': 'Conta desconhecida!', 'payload': None})


@app.route('/categorias')
@app.route('/categorias/')
def categorias():

    print(request.accept_mimetypes)
    if re.search('application/json', str(request.accept_mimetypes)) \
            and not re.search('text/html', str(request.accept_mimetypes)) \
            and not len(str(request.accept_mimetypes)) == 0 :

        categorias = CategoriaDAO().get_categorias()
        results = []
        for categoria in categorias:
            results.append(categoria.to_dict())

        return jsonify(results)

    else:
        return render_template('categorias.html')


@app.route('/categoria/', methods=['GET','POST'])
@app.route('/categoria/<id>', methods=['GET','POST','DELETE'])
def categoria(id=0):

    if request.method == 'GET':
        tipo = ""
        descricao = ""
        if int(id) != 0:
            categoria = CategoriaDAO().get_categoria(id)
            if categoria:
                descricao = categoria.descricao
                tipo = categoria.tipo
            else:
                id = 0

        return render_template('categoria.html',id=id, descricao=descricao, tipo=tipo )

    elif request.method == 'POST':

        categoria = Categoria()
        categoria.id = request.form["id"]
        categoria.descricao = request.form["descricao"]
        categoria.tipo = request.form["tipo"]

        if categoria.id == 0:
            categoria.id = CategoriaDAO().create_categoria(categoria)
        else:
            CategoriaDAO().update_categoria(categoria)

        return jsonify(categoria.to_dict())

    elif request.method == 'DELETE':
        if id != 0:
            dao = CategoriaDAO()
            categoria = dao.get_categoria(id)
            if categoria:
                result = dao.delete_categoria(categoria)
                if result == 1:
                    return jsonify({'status': 1, 'message': 'Categoria excluída com sucesso', 'payload': {'affectedRows': result}})

        return jsonify({'status': -1, 'message': 'Categoria desconhecida!', 'payload': None})

@app.route('/relatorio/por-categoria')
def relatorio_por_categoria():
    if re.search('application/json', str(request.accept_mimetypes)) \
            and not re.search('text/html', str(request.accept_mimetypes)) \
            and not len(str(request.accept_mimetypes)) == 0 :

        referencia = '05/2019'
        tipo = 'D'
        empresa = 1

        categorias = CategoriaDAO().consulta_por_categoria(empresa, tipo, referencia)
        for categoria in categorias:
            movimentos = MovimentoDAO().consulta_por_categoria(categoria["id_categoria"], referencia)
            categoria['movimentos'] = movimentos
        return jsonify(categorias)
    else:
        return render_template('consulta-por-categoria.html')

#app.run(host='0.0.0.0', port=5000, debug=True)