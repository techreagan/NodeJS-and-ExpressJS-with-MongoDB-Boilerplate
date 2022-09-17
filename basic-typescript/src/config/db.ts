import mongoose from 'mongoose'

const DBconnection = async () => {
	await mongoose
		.connect(process.env.MONGO_URI as string)
		.then((conn) => {
			console.log(
				`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
			)
		})
		.catch((err) => {
			console.log(`For some reasons we couldn't connect to the DB`.red, err)
		})
}

export default DBconnection
