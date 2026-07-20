# Landing page — Livro de Metáforas META2 FONO

Esta versão foi preparada para:

- hospedar o site no GitHub Pages;
- manter o PDF fora do repositório;
- realizar o download pelo Google Drive;
- funcionar em celulares, tablets e computadores.

## 1. Configure o Google Drive

No Google Drive, abra o PDF e selecione:

**Compartilhar → Acesso geral → Qualquer pessoa com o link → Leitor**

Copie o link de compartilhamento.

## 2. Cole o link no site

Abra o arquivo `config.js` e substitua:

```js
ebookDriveUrl: 'COLE_AQUI_O_LINK_PUBLICO_DO_GOOGLE_DRIVE'
```

pelo link copiado, por exemplo:

```js
ebookDriveUrl: 'https://drive.google.com/file/d/SEU_ID/view?usp=sharing'
```

Não é necessário converter manualmente o link. O JavaScript extrai o ID do arquivo e monta o endereço de download.

## 3. Publique no GitHub Pages

Envie para o repositório somente os arquivos desta pasta. O PDF não deve ser adicionado.

Estrutura esperada:

```text
index.html
styles.css
config.js
script.js
assets/
  capa-ebook.png
```

Em seguida, ative o GitHub Pages em **Settings → Pages**.

## Observação sobre os leads

O formulário atualmente salva os dados apenas no navegador da visitante (`localStorage`). Para captar leads de verdade, é necessário integrar o formulário ao Mailchimp, Google Sheets, RD Station ou outro serviço.
