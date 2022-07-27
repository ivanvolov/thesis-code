const fs = require('fs-extra')

const main = async () => {
  const template = await fs.readJSON(`network/graphTemplate.json`)

  //? DS
  let df = await fs.readJson('./data/MB_Traits.json')
  console.log('Df:', df.length)

  df = df
    .map((i) => ({
      id: i.token_id,
      from: i.seller,
      to: i.winner,
    }))
    .filter((i) => i.from && i.to)

  //?Whitelist
  let _whitelist = fs.readJsonSync('whitelist/res-from-alchemy-procecced3.json')
  const Whitelist = {}
  _whitelist.map((i) => {
    if (!Whitelist[i.from]) Whitelist[i.from] = 0
    Whitelist[i.from]++
  })

  //? Nodes here
  let nodes = {}
  df.forEach((i) => {
    if (!nodes[i.from]) nodes[i.from] = { count: 0, seller: 0, buyer: 0 }
    if (!nodes[i.to]) nodes[i.to] = { count: 0, seller: 0, buyer: 0 }

    nodes[i.from].count++
    nodes[i.from].seller++

    nodes[i.to].count++
    nodes[i.to].buyer++
  })

  nodes = Object.entries(nodes)
    // .filter(a => a[1].seller > 4 && a[1].buyer > 4 || Whitelist[a[0]])
    .filter((a) => a[1].count > 20)
    .map((a) => a[0])

  console.log('Nodes:', nodes.length)

  //? Edges
  let edges = {}
  df.forEach((i) => {
    const key = `${i.from}-${i.to}`
    if (!edges[key]) edges[key] = 0
    edges[key]++
  })

  edges = Object.entries(edges)
    .map((a) => ({
      from: a[0].split('-')[0],
      to: a[0].split('-')[1],
      weight: a[1],
    }))
    .filter((a) => a.weight > 0)
    .filter((a) => nodes.includes(a.from)) // insure node still exist in list
    .filter((a) => nodes.includes(a.to)) // insure node still exist in list

  console.log('Edges:', edges.length)

  //? Optimization
  const listOfNodesToDelete = {}

  //? Optimization

  //? Building
  const newGraph = Object.assign({}, template)
  newGraph.graph.nodes = []
  newGraph.graph.edges = []

  nodes.forEach((i) => {
    const node = {
      id: i,
      name: i,
      type: 'Person',
      type_id: '39431b2c-8b0a-7a06-5d4a-f4a6beef315e',
    }

    if (Whitelist[i]) {
      node.type = 'Whitelister'
      node.type_id = '39431b2c-8b0a-7a06-5d4a-f4a6beef315f'
      node.properties = {
        Received: String(Whitelist[i]),
      }
    }

    newGraph.graph.nodes.push(node)
  })

  edges.forEach((i) => {
    newGraph.graph.edges.push({
      from: i.from,
      to: i.to,
      type_id: '973bcad4-8a3c-8079-bc17-1d97684629ef',
      name: 'Flow',
      weight: i.weight,
      directed: 1,
    })
  })
  await fs.writeJSON('network/graph.json', newGraph)
  process.exit(0)
}

main()
