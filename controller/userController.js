let users = [];


export function get(req, res){
    return res.json(users);
}

export function post(req, res){
    const {name, email} = req.body

    const user = {id: Date.now(), name, email}

    users.push(user);

    return res.status(201).json(user);

}

export function remove(req, res){
    const {id} = req.params

    const exists = users.some((u) => u.id == id)
    if(!exists) return res.status(404).json({error: "nao encontrado"})

    users = users.filter((u) => u.id != id)

    return res.status(204).send();
}