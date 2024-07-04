function status(request, response) {
  response.status(200).send({ chave: "são acima da média" });
}

export default status;
