const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')

const createProduct = async (req, res) => {
	try {
		const product = await Product.create(req.body)
		res.status(StatusCodes.CREATED).json(product)
	} catch (error) {
		res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Something went wrong. Try again.' })
	}
}

const getAllProducts = async (req, res) => {
	const products = await Product.find({})
  res.status(StatusCodes.OK).json({ products, count: products.length })
}

module.exports = {
	createProduct,
	getAllProducts,
}
