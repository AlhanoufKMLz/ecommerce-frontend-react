import React, { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ProductFormModalProp, Product, ProductSchema, productSchema } from '../../types/types'
import { AppDispatch } from '../../redux/store'
import { addProduct, editProdect } from '../../redux/slices/products/productSlice'

const initialState = {
  id: Number(new Date()),
  name: '',
  image: '',
  description: '',
  price: 0,
  categories: [],
  variants: [],
  sizes: [],
  quantity: 0
}

export default function ProductFormModal(prop: ProductFormModalProp) {
  if (!prop.isOpen) return null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProductSchema>({ resolver: zodResolver(productSchema) })

  const dispatch = useDispatch<AppDispatch>()
  const [productChanges, setProductChanges] = useState<Product>(initialState)

  useEffect(() => {
    if (prop.product) {
      setProductChanges(prop.product)
      reset()
    }
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const isList = name === 'categories' || name === 'variants' || name === 'sizes'
    if (isList) {
      setProductChanges({
        ...productChanges,
        [name]: value.split(',')
      })
      return
    }
    setProductChanges({
      ...productChanges,
      [name]: value
    })
  }

  const handleFormSubmit = () => {
    if (!prop.product) {
      dispatch(addProduct({ product: productChanges }))
      toast.success('Product added successfully!')
    } else {
      dispatch(editProdect({ newProduct: productChanges }))
      toast.success('Product details updated successfully!')
    }
    // Reset the useState
    setProductChanges(initialState)
    // Close the form
    prop.setIsModalOpen(false)
  }

  const handleCloseModal = () => {
    prop.setIsModalOpen(false)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form className="p-4 bg-gray-100 rounded-lg" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="flex justify-between">
            {/* name container */}
            <div className="mb-4">
              <label htmlFor="name" className="flex flex-col text-primary_pink">
                <span className="text-primary_green pl-2">Name:</span>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="border-2 border-primary_grey h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                  value={productChanges.name}
                  onChange={handleChange}
                />

                {errors.name && <span className="text-primary_pink"> {errors.name.message} </span>}
              </label>
            </div>

            {/* price container */}
            <div className="mb-4">
              <label htmlFor="price" className="flex flex-col text-primary_pink">
                <span className="text-primary_green pl-2">Price:</span>
                <input
                  type="number"
                  id="price"
                  {...register('price', { valueAsNumber: true })}
                  className="border-2 border-primary_grey h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                  value={productChanges.price}
                  onChange={handleChange}
                />
                {errors.price && (
                  <span className="text-primary_pink"> {errors.price.message} </span>
                )}
              </label>
            </div>
          </div>

          {/* image container */}
          <div className="mb-4">
            <label htmlFor="image" className="flex flex-col text-primary_pink">
              <span className="text-primary_green pl-2">Image URL:</span>
              <input
                type="text"
                id="image"
                {...register('image')}
                className="border-2 border-primary_grey h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                value={productChanges.image}
                onChange={handleChange}
              />
              {errors.image && <span className="text-primary_pink"> {errors.image.message} </span>}
            </label>
          </div>

          {/* description container */}
          <div className="mb-4">
            <label htmlFor="description" className="flex flex-col text-primary_pink">
              <span className="text-primary_green pl-2">Description:</span>
              <textarea
                id="description"
                {...register('description')}
                className="border-2 border-primary_grey h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                value={productChanges.description}
                onChange={handleChange}
              />
              {errors.description && (
                <span className="text-primary_pink"> {errors.description.message} </span>
              )}
            </label>
          </div>

          {/* categories container */}
          <div className="mb-4">
            <label htmlFor="categories" className="flex flex-col text-primary_pink">
              <span className="text-primary_green pl-2">
                Categories: (use comma , to create multiple)
              </span>
              <input
                type="text"
                id="categories"
                {...register('categories')}
                className="border-2 border-primary_grey h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                onChange={handleChange}
                value={productChanges.categories.join(',')}
              />
              {errors.categories && (
                <span className="text-primary_pink"> {errors.categories.message} </span>
              )}
            </label>
          </div>

          {/* variants container */}
          <div className="mb-4">
            <label htmlFor="variants" className="flex flex-col text-primary_pink">
              <span className="text-primary_green pl-2">
                Variants: (use comma , to create multiple)
              </span>
              <input
                type="text"
                id="variants"
                {...register('variants')}
                className="border-2 border-primary_grey h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                onChange={handleChange}
                value={productChanges.variants.join(',')}
              />
              {errors.variants && (
                <span className="text-primary_pink"> {errors.variants.message} </span>
              )}
            </label>
          </div>

          {/* sizes container */}
          <div className="mb-4">
            <label htmlFor="sizes" className="flex flex-col text-primary_pink">
              <span className="text-primary_green pl-2">
                Sizes: (use comma , to create multiple)
              </span>
              <input
                type="text"
                id="sizes"
                {...register('sizes')}
                className="border-2 border-primary_grey h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                onChange={handleChange}
                value={productChanges.sizes.join(',')}
              />
              {errors.sizes && <span className="text-primary_pink"> {errors.sizes.message} </span>}
            </label>
          </div>

          {/* buttons container */}
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="h-16 w-16 bg-primary_green rounded-full text-primary_grey shadow-md hover:shadow-none hover:bg-primary_grey hover:text-primary_green shadow-shadow">
              {prop.product ? <span>Save</span> : <span>add</span>}
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="h-16 w-16 bg-primary_pink rounded-full text-primary_grey shadow-md hover:shadow-none hover:bg-primary_grey hover:text-primary_pink shadow-shadow">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
