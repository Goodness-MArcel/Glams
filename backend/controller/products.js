
import { supabaseServer as supabase } from '../supabase/serverConfig.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    
    const {
      name,
      description,
      category,
      size_volume,
      unit_type,
      price,
      cost_price,
      stock_quantity,
      reorder_level,
      water_source,
      treatment_process,
      product_code
    } = req.body;

    // Validate required fields
    if (!name || !category || !size_volume || !price || !stock_quantity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, category, size_volume, price, stock_quantity'
      });
    }

    let image_url = null;
    
    // Handle image upload if file is provided
    if (req.file) {
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      
      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image',
          error: uploadError.message
        });
      }

      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      image_url = urlData.publicUrl;
    }

    // Insert product into database
    const { data: product, error: dbError } = await supabase
      .from('products')
      .insert([{
        name,
        description,
        category,
        size_volume,
        unit_type,
        price: parseFloat(price),
        cost_price: cost_price ? parseFloat(cost_price) : null,
        stock_quantity: parseInt(stock_quantity),
        reorder_level: reorder_level ? parseInt(reorder_level) : 50,
        water_source,
        treatment_process,
        product_code,
        image_url,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: dbError.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


// Update existing product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Updating product ID:', id);
    console.log('Update data:', req.body);
    console.log('Uploaded file:', req.file);
    
    // Validate product ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const {
      name,
      description,
      category,
      size_volume,
      unit_type,
      price,
      cost_price,
      stock_quantity,
      reorder_level,
      water_source,
      treatment_process,
      product_code
    } = req.body;

    let image_url = existingProduct.image_url; // Keep existing image by default
    
    // Handle new image upload if file is provided
    if (req.file) {
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      
      // Upload new image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload new image',
          error: uploadError.message
        });
      }

      // Get public URL for the new uploaded image
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      image_url = urlData.publicUrl;

      // Optionally delete old image (if you want to clean up)
      if (existingProduct.image_url) {
        const oldFileName = existingProduct.image_url.split('/').pop();
        await supabase.storage
          .from('product-images')
          .remove([oldFileName]);
      }
    }

    // Prepare update data
    const updateData = {
      name: name || existingProduct.name,
      description: description !== undefined ? description : existingProduct.description,
      category: category || existingProduct.category,
      size_volume: size_volume || existingProduct.size_volume,
      unit_type: unit_type || existingProduct.unit_type,
      price: price ? parseFloat(price) : existingProduct.price,
      cost_price: cost_price ? parseFloat(cost_price) : existingProduct.cost_price,
      stock_quantity: stock_quantity ? parseInt(stock_quantity) : existingProduct.stock_quantity,
      reorder_level: reorder_level ? parseInt(reorder_level) : existingProduct.reorder_level,
      water_source: water_source !== undefined ? water_source : existingProduct.water_source,
      treatment_process: treatment_process !== undefined ? treatment_process : existingProduct.treatment_process,
      product_code: product_code !== undefined ? product_code : existingProduct.product_code,
      image_url,
      updated_at: new Date().toISOString()
    };

    // Update product in database
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: updateError.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the product to check if it has an image
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Fetch product error:', fetchError);
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        error: fetchError.message
      });
    }

    // Delete the product image from storage if it exists
    if (existingProduct.image_url) {
      try {
        // Extract the file path from the URL
        const urlParts = existingProduct.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        const { error: storageError } = await supabase.storage
          .from('product-images')
          .remove([fileName]);

        if (storageError) {
          console.error('Storage delete error:', storageError);
          // Continue with product deletion even if image deletion fails
        } else {
          console.log('Product image deleted from storage:', fileName);
        }
      } catch (storageError) {
        console.error('Error deleting image from storage:', storageError);
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete the product from database
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete product error:', deleteError);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: deleteError.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: { id }
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};