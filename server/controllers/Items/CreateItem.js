import Item from '../../models/Item.js'

const createItem = async (req, res) => {
    try {
        const { name, userId, description, type, location, date, number, img } = req.body

        console.log('CreateItem body:', { name, userId, type, location, date, number, imgCount: img?.length })

        // If no images sent, use the default placeholder
        const images = (Array.isArray(img) && img.length > 0)
            ? img
            : ['https://i.ibb.co/DpZ3qy2/Untitled-design-10.png']

        const newItem = new Item({
            name,
            userId,
            description,
            type,
            location,
            date,
            number,
            img: images,
        })

        await newItem.save()
        console.log('Item saved:', newItem._id)
        res.status(200).json({ ok: true, msg: 'Item Created', id: newItem._id })

    } catch (error) {
        console.error('CreateItem error:', error.message)
        res.status(500).json({
            ok: false,
            msg: error.message || 'An error occurred',
        })
    }
}

export default createItem
