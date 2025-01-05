import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface Order {
  products: Product[];
  total: number;
}

interface UserInfo {
  name: string;
  email: string;
  mobile: string;
  address: string;
  location: { lat: number; lng: number } | null;
}

const mockProducts: Product[] = [
  { id: 1, name: 'Burger Classique', price: 8.99, image: 'https://picsum.photos/200/300?random=1' },
  { id: 2, name: 'Pizza Margherita', price: 12.99, image: 'https://picsum.photos/200/300?random=2' },
  { id: 3, name: 'Burger Végétarien', price: 9.99, image: 'https://picsum.photos/200/300?random=3' },
  { id: 4, name: 'Pizza Pepperoni', price: 14.99, image: 'https://picsum.photos/200/300?random=4' },
];

const App: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    mobile: '',
    address: '',
    location: null,
  });
  const [step, setStep] = useState<'menu' | 'checkout'>('menu');

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = () => {
    setOrder({
      products: cart,
      total: calculateTotal(),
    });
    setStep('checkout');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleLocationClick = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserInfo({
          ...userInfo,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
      }
    );
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Commande passée avec succès!');
    setCart([]);
    setOrder(null);
    setStep('menu');
  };

  return (
    <div className="min- bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Burger-Pizza</h1>

        {step === 'menu' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                  <p className="text-gray-600">€{product.price.toFixed(2)}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Finalisez votre commande</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={userInfo.mobile}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={handleLocationClick}
                  className="absolute top-2 right-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Me localiser
                </button>
                {userInfo.location && (
                  <div className="absolute w-4 h-4 bg-red-600 rounded-full transform -translate-x-1/2 -translate-y-1/2" style={{ top: '50%', left: '50%' }} />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Valider la commande
            </button>
          </form>
        )}

        {step === 'menu' && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Panier</h3>
                <p className="text-gray-600">{cart.length} articles</p>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Valider le panier (€{calculateTotal().toFixed(2)})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;