import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();

    res.json({
      status: 200,
      message: 'Products fetched successfully',
      data: products,
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({
      status: 500,
      message: 'Failed to fetch products',
      data: null,
    });
  }
};

export const createProduct = async (req: any, res: any) => {
  try {
    const { name, price, quantity, desc, categoryId ,url} = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price: parseInt(price),
        quantity: parseInt(quantity),
        desc,
      },
      
    })
    const categoryIdNumber = parseInt(categoryId)
    await prisma.productcategory.create({
      data: {
        category: {
          connect: {
            category_id: categoryIdNumber
          }
        },
        product: {
          connect: {
            product_id: product.product_id
          }
        },
      }
    });

    
    await prisma.media.create({
      data : {
        name,
        url,
        product: {
          connect: {
            product_id: product.product_id
          }
        },
        
      }
    });

    const category = await prisma.category.findFirst(categoryId);

    res.json({
      status: 201,
      message: 'Product created successfully',
      data: {
        ...product,
        category: {
          name : category.name
        },
        media : {
          url : url
        }
      },
    });
    
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      status: 500,
      message: 'Failed to create product',
      data: null,
    });
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productId = Number(id); // Convert id to number

    const { name, price, quantity, desc ,categoryId,url} = req.body;

    // Check if the product with the given ID exists
    const existingProduct = await prisma.product.findUnique({
      where: {
        product_id: productId,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        status: 404,
        message: 'Product not found',
      });
    }

    

    // Build the data object for updating specific fields
    const updateData: any = {
      ...(name && { name }),
      ...(price && { price: parseInt(price) }),
      ...(quantity && { quantity: parseInt(quantity) }),
      ...(desc && { desc }),
    };

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: {
        product_id: productId,
      },
      data: updateData,
    });

    const categoryData: any ={
      ...(categoryId &&{categoryId : parseInt(categoryId)}),
    }

    await prisma.productcategory.update({
      where: {
        id : productId,
      },
      data : categoryData,
    });
    

    res.json({
      status: 200,
      message: 'Product updated successfully',
      data: {
        product : updatedProduct,
      }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      status: 500,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

export const categories =async (req:any,res:any) => {
  try {
    const categories = await prisma.category.findMany();

    res.json({
      status: 200,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({
      status: 500,
      message: 'Failed to retrieve categories',
      error: error.message,
    });
  }
};