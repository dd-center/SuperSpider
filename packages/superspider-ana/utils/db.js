const MongoClient = require('mongodb').MongoClient
// DB Init

const client = new MongoClient(
  `mongodb://admin:${process.env.MONGODB_PASS}@${process.env.MONGODB_IP}:27017/admin?authMechanism=DEFAULT`,
  { useNewUrlParser: true }
)

const connect = client.connect().catch((err) => {
  console.log('ERR when connect to AMDB')
  console.log(err)
  process.exit(1)
})

const amdbP = connect.then(() => client.db('amdb').collection('maindb'))

const utrdbP = connect.then(() => client.db('amdb').collection('utrdb'))

module.exports = { amdbP, utrdbP }
