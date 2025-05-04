import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Select,
  MenuItem
} from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function ManagerDashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({
    totalVans: 0,
    availableVans: 0,
    fuelDistribution: [],
    statusDistribution: []
  });
  const [recentVans, setRecentVans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [vansRes, fuelRes, statusRes] = await Promise.all([
          axios.get('/api/vehicles/manager', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/vehicles/stats/fuel'),
          axios.get('/api/vehicles/stats/status')
        ]);

        setRecentVans(vansRes.data.slice(0, 5));
        setStats({
          totalVans: vansRes.data.length,
          availableVans: vansRes.data.filter(v => v.status === 'AVAILABLE').length,
          fuelDistribution: fuelRes.data,
          statusDistribution: statusRes.data
        });
      } catch (error) {
        console.error('Dashboard data fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Quick status update handler
  const handleStatusChange = async (vanId, newStatus) => {
    try {
      await axios.patch(`/api/vehicles/${vanId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentVans(recentVans.map(van => 
        van.id === vanId ? { ...van, status: newStatus } : van
      ));
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name} - Vehicle Management Dashboard
      </Typography>

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Vans</Typography>
              <Typography variant="h4">{stats.totalVans}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Available Now</Typography>
              <Typography variant="h4">{stats.availableVans}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Fuel Type Distribution</Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={stats.fuelDistribution}
                  dataKey="count"
                  nameKey="fuelType"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {stats.fuelDistribution.map((entry, index) => (
                    <Cell key={index} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Status Distribution</Typography>
              <BarChart width={400} height={300} data={stats.statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Vans Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recently Added Vans</Typography>
          <Grid container spacing={2}>
            {recentVans.map(van => (
              <Grid item xs={12} key={van.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body1">{van.brand} {van.model}</Typography>
                        <Typography variant="body2">Plate: {van.plateNumber}</Typography>
                      </Grid>
                      
                      <Grid item xs={3}>
                        <Select
                          value={van.status}
                          onChange={(e) => handleStatusChange(van.id, e.target.value)}
                          size="small"
                          fullWidth
                        >
                          <MenuItem value="AVAILABLE">Available</MenuItem>
                          <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                          <MenuItem value="RESERVED">Reserved</MenuItem>
                        </Select>
                      </Grid>

                      <Grid item xs={3}>
                        <Typography>Rate: ${van.ratePerDay}/day</Typography>
                        <Typography>Capacity: {van.capacity}</Typography>
                      </Grid>

                      <Grid item xs={2}>
                        <Button 
                          variant="contained" 
                          size="small"
                          href={`/manager/vans/${van.id}`}
                        >
                          Details
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Quick Action Buttons */}
      <Button 
        variant="contained" 
        color="primary" 
        href="/manager/vans/add"
        sx={{ mr: 2 }}
      >
        Add New Van
      </Button>
      <Button 
        variant="outlined" 
        href="/manager/vans"
      >
        View All Vans
      </Button>
    </Container>
  );
}
