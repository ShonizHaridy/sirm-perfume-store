import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import AdminSidebar from '../../components/admin/Sidebar';
import { productService } from '../../services'; // Use service instead of direct axios
import { adminService } from '../../services'; // Use service instead of direct axios


const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    nameAr: '',
    price: '',
    category: '',
    description: '',
    descriptionAr: '',
    image: null,
    boxImage: null
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null); // Add error state


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        // Ensure products is always an array
        setProducts(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]); // Set to empty array on error
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Mock data for development
    // setTimeout(() => {
    //   const mockProducts = [
    //     {
    //       _id: '1',
    //       name: 'Musk 100ml',
    //       nameAr: 'مسك 100مل',
    //       price: 230.00,
    //       currency: '﷼',
    //       image: '/images/musk_bottle.png',
    //       boxImage: '/images/musk_box.png',
    //       category: 'spray',
    //       stock: 45
    //     },
    //     {
    //       _id: '2',
    //       name: 'The fifth 100ml',
    //       nameAr: 'ذا فيفث 100مل',
    //       price: 230.00,
    //       currency: '﷼',
    //       image: '/images/fifth_bottle.png',
    //       boxImage: '/images/fifth_box.png',
    //       category: 'spray',
    //       stock: 32
    //     },
    //     {
    //       _id: '3',
    //       name: 'Flow of three 100ml',
    //       nameAr: 'فلو أوف ثري 100مل',
    //       price: 230.00,
    //       currency: '﷼',
    //       image: '/images/flow_bottle.png',
    //       boxImage: '/images/flow_box.png',
    //       category: 'spray',
    //       stock: 18
    //     },
    //     {
    //       _id: '4',
    //       name: 'Bliss 100ml',
    //       nameAr: 'بليس 100مل',
    //       price: 230.00,
    //       currency: '﷼',
    //       image: '/images/bliss_bottle.png',
    //       boxImage: '/images/bliss_box.png',
    //       category: 'spray',
    //       stock: 27
    //     }
    //   ];
      
    //   setProducts(mockProducts);
    //   setLoading(false);
    // }, 1000);

    fetchProducts(); // Uncomment when backend is connected
  }, []);

  const filteredProducts = Array.isArray(products) ? 
    products.filter(product => 
      product && (
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (product.nameAr && product.nameAr.includes(searchQuery))
      )
    ) : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: files[0]
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      Object.keys(newProduct).forEach(key => {
        if (key === 'image' || key === 'boxImage') {
          if (newProduct[key]) {
            formData.append(key, newProduct[key]);
          }
        } else {
          formData.append(key, newProduct[key]);
        }
      });
      
      // Mock response for development
      // const mockResponse = {
      //   _id: Date.now().toString(),
      //   ...newProduct,
      //   image: '/images/new_bottle.png',
      //   boxImage: '/images/new_box.png',
      //   currency: '﷼',
      //   stock: 20
      // };
      
      // setProducts([...products, mockResponse]);
      

      
      // With backend:
      const newProductData = await adminService.createProduct(formData);


      setProducts(prevProducts => 
        Array.isArray(prevProducts) ? [...prevProducts, newProductData] : [newProductData]
      );
      setNewProduct({
        name: '',
        nameAr: '',
        price: '',
        category: '',
        description: '',
        descriptionAr: '',
        image: null,
        boxImage: null
      });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product. Please try again.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      image: null,
      boxImage: null
    });
    setShowAddForm(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      Object.keys(editingProduct).forEach(key => {
        if (key === 'image' || key === 'boxImage') {
          if (editingProduct[key]) {
            formData.append(key, editingProduct[key]);
          }
        } else if (key !== '_id') {
          formData.append(key, editingProduct[key]);
        }
      });
      
      // Mock update for development
      // const updatedProducts = products.map(product => 
      //   product._id === editingProduct._id ? 
      //     {...product, ...editingProduct, image: product.image, boxImage: product.boxImage} : 
      //     product
      // );
      await productService.updateProduct(editingProduct._id, formData);

      
      // Get fresh data after update
      const updatedProducts = await productService.getAllProducts();
      setProducts(Array.isArray(updatedProducts) ? updatedProducts : []);
      
      setEditingProduct(null);
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product. Please try again.');
    }
  };
      


  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {

        // // Mock delete for development
        // setProducts(products.filter(product => product._id !== id));
        // Use service instead of direct axios
        await productService.deleteProduct(id);
        
        // Update state safely
        setProducts(prevProducts => 
          Array.isArray(prevProducts) ? prevProducts.filter(product => product._id !== id) : []
        );
        setError(null);
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product. Please try again.');
      }
    }
  };


  if (loading) return <div>Loading products...</div>;

  return (
    <AdminLayout>
      <AdminSidebar />
      <MainContent>
        <PageHeader>
          <div>
            <h1>Products Management</h1>
            <p>Manage your store products</p>
          </div>
          <AddButton onClick={() => {
            setEditingProduct(null);
            setShowAddForm(true);
          }}>
            <FaPlus />
            <span>Add Product</span>
          </AddButton>
        </PageHeader>
        
        <SearchBar>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
        
        {showAddForm && (
          <FormOverlay>
            <ProductForm onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
              <FormHeader>
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <CloseButton onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}>×</CloseButton>
              </FormHeader>
              
              <FormGrid>
                <FormGroup>
                  <label>Product Name (English)</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={editingProduct ? editingProduct.name : newProduct.name} 
                    onChange={editingProduct ? 
                      (e) => setEditingProduct({...editingProduct, name: e.target.value}) : 
                      handleInputChange
                    }
                    required 
                  />
                </FormGroup>
                
                <FormGroup>
                  <label>Product Name (Arabic)</label>
                  <input 
                    type="text" 
                    name="nameAr" 
                    value={editingProduct ? editingProduct.nameAr : newProduct.nameAr} 
                    onChange={editingProduct ? 
                      (e) => setEditingProduct({...editingProduct, nameAr: e.target.value}) : 
                      handleInputChange
                    }
                    required 
                  />
                </FormGroup>
                
                <FormGroup>
                  <label>Price (SAR)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={editingProduct ? editingProduct.price : newProduct.price} 
                    onChange={editingProduct ? 
                      (e) => setEditingProduct({...editingProduct, price: e.target.value}) : 
                      handleInputChange
                    }
                    required 
                  />
                </FormGroup>
                
                <FormGroup>
                  <label>Category</label>
                  <select 
                    name="category" 
                    value={editingProduct ? editingProduct.category : newProduct.category} 
                    onChange={editingProduct ? 
                      (e) => setEditingProduct({...editingProduct, category: e.target.value}) : 
                      handleInputChange
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="spray">All Over Spray</option>
                    <option value="perfume">Perfume</option>
                    <option value="candle">Candle</option>
                    <option value="gift">Gift Set</option>
                  </select>
                </FormGroup>
                
                <FormGroup fullWidth>
                  <label>Description (English)</label>
                  <textarea 
                    name="description" 
                    value={editingProduct ? editingProduct.description : newProduct.description} 
                    onChange={editingProduct ? 
                      (e) => setEditingProduct({...editingProduct, description: e.target.value}) : 
                      handleInputChange
                    }
                    rows="3"
                  />
                </FormGroup>
                
                <FormGroup fullWidth>
                  <label>Description (Arabic)</label>
                  <textarea 
                    name="descriptionAr" 
                    value={editingProduct ? editingProduct.descriptionAr : newProduct.descriptionAr} 
                    onChange={editingProduct ? 
                      (e) => setEditingProduct({...editingProduct, descriptionAr: e.target.value}) : 
                      handleInputChange
                    }
                    rows="3"
                  />
                </FormGroup>
                
                <FormGroup>
                  <label>Product Image</label>
                  <input 
                    type="file" 
                    name="image" 
                    onChange={editingProduct ? 
                      (e) => setEditingProduct({...editingProduct, image: e.target.files[0]}) : 
                      handleFileChange
                    } 
                    accept="image/*"
                    required={!editingProduct}
                  />
                  {editingProduct && editingProduct.image && (
                    <ImagePreview>Current: {editingProduct.image}</ImagePreview>
                  )}
                </FormGroup>
                
                <FormGroup>
                  <label>Box Image</label>
                  <input 
                    type="file" 
                    name="boxImage" 
                    onChange={editingProduct ? 
                      (e) => setEditingProduct({...editingProduct, boxImage: e.target.files[0]}) : 
                      handleFileChange
                    } 
                    accept="image/*"
                    required={!editingProduct}
                  />
                  {editingProduct && editingProduct.boxImage && (
                    <ImagePreview>Current: {editingProduct.boxImage}</ImagePreview>
                  )}
                </FormGroup>
              </FormGrid>
              
              <FormActions>
                <CancelButton type="button" onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </SubmitButton>
              </FormActions>
            </ProductForm>
          </FormOverlay>
        )}
        
        <ProductsTable>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Arabic Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  <ProductImage src={product.image} alt={product.name} />
                </td>
                <td>{product.name}</td>
                <td>{product.nameAr}</td>
                <td>{product.currency} {product.price.toFixed(2)}</td>
                <td>
                  <CategoryBadge category={product.category}>
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </CategoryBadge>
                </td>
                <td>{product.stock}</td>
                <td>
                  <ActionButtons>
                    <EditButton onClick={() => handleEditProduct(product)}>
                      <FaEdit />
                    </EditButton>
                    <DeleteButton onClick={() => handleDeleteProduct(product._id)}>
                      <FaTrash />
                    </DeleteButton>
                  </ActionButtons>
                </td>
              </tr>
            ))}
          </tbody>
        </ProductsTable>
      </MainContent>
    </AdminLayout>
  );
};

// Styled Components
const AdminLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 24px;
    color: var(--primary-color);
    margin-bottom: 5px;
  }
  
  p {
    color: #777;
    font-size: 14px;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  
  span {
    margin-left: 8px;
  }
  
  &:hover {
    background-color: var(--accent-color);
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: var(--secondary-color);
  }
`;

const ProductsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f9f9f9;
    font-weight: 600;
    color: var(--primary-color);
  }
  
  tbody tr:hover {
    background-color: #f9f9f9;
  }
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
  border-radius: 4px;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch (props.category) {
      case 'spray':
        return `
          background-color: #e6f7e9;
          color: #2ecc71;
        `;
      case 'perfume':
        return `
          background-color: #e6f0f9;
          color: #3498db;
        `;
      case 'candle':
        return `
          background-color: #fef4e6;
          color: #f39c12;
        `;
      case 'gift':
        return `
          background-color: #f0e6f9;
          color: #9b59b6;
        `;
      default:
        return `
          background-color: #f5f5f5;
          color: #777;
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const EditButton = styled.button`
  background-color: #e6f0f9;
  color: #3498db;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #3498db;
    color: white;
  }
`;

const DeleteButton = styled.button`
  background-color: #fde9e9;
  color: #e74c3c;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #e74c3c;
    color: white;
  }
`;

const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ProductForm = styled.form`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  
  h2 {
    font-size: 20px;
    color: var(--primary-color);
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #777;
  
  &:hover {
    color: #e74c3c;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  grid-column: ${props => props.fullWidth ? 'span 2' : 'span 1'};
  
  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--primary-color);
  }
  
  input, textarea, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: var(--secondary-color);
    }
  }
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const ImagePreview = styled.div`
  font-size: 12px;
  color: #777;
  margin-top: 5px;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #eee;
  gap: 10px;
`;

const CancelButton = styled.button`
  background-color: #f5f5f5;
  color: #333;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const SubmitButton = styled.button`
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: var(--accent-color);
  }
`;

export default AdminProducts;