const path = require('path')
const fs = require('fs')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const cloudinary = require('cloudinary').v2

const uploadProductImageLocal = async (req, res) => {
	if (!req.files) throw new CustomError.BadRequestError('No file Uploaded')

	let productImage = req.files.image

	if (!productImage.mimetype.startsWith('image')) {
		throw new CustomError.BadRequestError('Please upload an image')
	}

	const maxSize = 1044 * 1024

	if (productImage.size > maxSize) {
		throw new CustomError.BadRequestError('Please upload image smaller 1MB')
	}

	const dir = path.join(__dirname, '../public/uploads')
	const imagePath = dir + `/${productImage.name}`

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir)
	}

	await productImage.mv(imagePath)

	return res.status(StatusCodes.OK).json({ image: { src: `/uploads/${productImage.name}` } })
}

const uploadProductImage = async (req, res) => {
	if (!req.files) throw new CustomError.BadRequestError('No file Uploaded')

	const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
		use_filename: true,
		folder: 'file-upload',
	})

	fs.unlinkSync(req.files.image.tempFilePath)
	return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } })
}

module.exports = {
	uploadProductImage,
}
