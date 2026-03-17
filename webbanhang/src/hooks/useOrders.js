// src/hooks/useOrders.js
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchOrders = async (params = {}) => {
    setLoading(true);
    try {
      // Gọi API qua service
      const response = await orderService.getOrders(params);
      setOrders(response.data);
      return response;
    } catch (error) {
      toast.error('Không thể tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      // Cập nhật local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      toast.success('Cập nhật trạng thái thành công!');
    } catch (error) {
      toast.error('Cập nhật thất bại');
    }
  };

  // Load data khi component mount
  useEffect(() => {
    fetchOrders();
    loadStats();
  }, []);

  return { orders, loading, stats, fetchOrders, updateOrderStatus, /* ... */ };
};