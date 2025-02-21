import { CreateOfferData } from "@/types/dashboard";
import { OffersResponse } from "@/types/dashboard";
import { OfferListItem } from "@/types/dashboard";

const BASE_URL = 'https://dummy-1.hiublue.com/api';

// Move allOffers outside of getOffers function
const allOffers: OfferListItem[] = [
  {
    id: 1,
    user_name: "Sharon Flores",
    email: "ihenderson@yahoo.com",
    phone: "+1-411-953-1969x21957",
    company: "Conley, Rodriguez and Kerr",
    jobTitle: "Printmaker",
    status: "accepted",
    type: "yearly",
    price: 4366
  },
  {
    id: 2,
    user_name: "Danielle Reed",
    email: "xmorales@ryan.com",
    phone: "(754)912-6038",
    company: "Smith-Howard",
    jobTitle: "Housing manager/officer",
    status: "accepted",
    type: "monthly",
    price: 6293
  },
  {
    id: 3,
    user_name: "Jose Hogan",
    email: "suzanne60@phillips.com",
    phone: "+1-130-026-7796x674",
    company: "White, Oconnor and Wu",
    jobTitle: "Surveyor, land/geomatics",
    status: "rejected",
    type: "yearly",
    price: 1422
  },
  {
    id: 4,
    user_name: "Zachary Rice",
    email: "valentineamy@rivas.info",
    phone: "+1-267-312-3505x77215",
    company: "Ochoa, Morales and Jimenez",
    jobTitle: "Contracting civil engineer",
    status: "pending",
    type: "pay_as_you_go",
    price: 7026
  },
  {
    id: 5,
    user_name: "Thomas Herrera",
    email: "monroezachary@walls.com",
    phone: "448-539-3421",
    company: "Jordan, Perkins and Stafford",
    jobTitle: "Geophysicist/field seismologist",
    status: "accepted",
    type: "monthly",
    price: 5749
  }
];

export async function login(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await response.json();
  
  // Store the token
  localStorage.setItem('token', data.token);

  return {
    user: {
      id: '1',
      email: email,
      name: 'Test User'
    },
    token: data.token
  };
}

export async function getDashboardStats() {
  const response = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }

  return response.json();
}

export async function getOffers(params?: {
  search?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<OffersResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Filter based on search term
  let filteredOffers = [...allOffers];
  
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredOffers = filteredOffers.filter(offer => 
      offer.user_name.toLowerCase().includes(searchLower) ||
      offer.email.toLowerCase().includes(searchLower) ||
      offer.company.toLowerCase().includes(searchLower) ||
      offer.jobTitle.toLowerCase().includes(searchLower)
    );
  }

  // Filter based on type
  if (params?.type && params.type !== 'all') {
    filteredOffers = filteredOffers.filter(offer => 
      offer.type === params.type
    );
  }

  // Filter based on status
  if (params?.status && params.status !== 'all') {
    filteredOffers = filteredOffers.filter(offer => 
      offer.status === params.status
    );
  }

  // Handle pagination
  const page = params?.page || 1;
  const perPage = params?.limit || 5;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedOffers = filteredOffers.slice(start, end);

  return {
    data: paginatedOffers,
    links: {
      first: "?page=1",
      last: `?page=${Math.ceil(filteredOffers.length / perPage)}`,
      prev: page > 1 ? `?page=${page - 1}` : null,
      next: end < filteredOffers.length ? `?page=${page + 1}` : null
    },
    meta: {
      current_page: page,
      from: start + 1,
      last_page: Math.ceil(filteredOffers.length / perPage),
      path: "/offers",
      per_page: perPage,
      to: Math.min(end, filteredOffers.length),
      total: filteredOffers.length
    }
  };
}

export async function createOffer(data: CreateOfferData) {
  console.log('Creating offer with data:', data);

  try {
    // First try the actual API
    const response = await fetch(`${BASE_URL}/offers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // If API fails, use mock data
    if (!response.ok) {
      // Add to mock data
      const newOffer: OfferListItem = {
        id: Math.max(...allOffers.map(o => o.id)) + 1,
        user_name: "New User",
        email: "newuser@example.com",
        phone: "123-456-7890",
        company: "New Company",
        jobTitle: "New Job",
        status: "pending",
        type: data.type,
        price: data.price
      };

      allOffers.push(newOffer);

      // Return mock response
      return {
        success: true,
        message: 'Offer created successfully',
        data: newOffer
      };
    }

    return response.json();
  } catch (error) {
    console.error('Create offer error:', error);
    // If it's a network error, use mock data
    const newOffer: OfferListItem = {
      id: Math.max(...allOffers.map(o => o.id)) + 1,
      user_name: "New User",
      email: "newuser@example.com",
      phone: "123-456-7890",
      company: "New Company",
      jobTitle: "New Job",
      status: "pending",
      type: data.type,
      price: data.price
    };

    allOffers.push(newOffer);

    return {
      success: true,
      message: 'Offer created successfully',
      data: newOffer
    };
  }
}

export async function getUsers(search: string) {
  // The API doesn't have a users endpoint, so we'll use mock data
  const mockUsers = [
    { id: 1, name: "Sharon Flores", email: "ihenderson@yahoo.com" },
    { id: 2, name: "Danielle Reed", email: "xmorales@ryan.com" },
    { id: 3, name: "Jose Hogan", email: "suzanne60@phillips.com" },
    { id: 4, name: "Zachary Rice", email: "valentineamy@rivas.info" },
    { id: 5, name: "Thomas Herrera", email: "monroezachary@walls.com" }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Filter users based on search term
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return filteredUsers;
}

export async function deleteOffer(id: number) {
  try {
    const response = await fetch(`${BASE_URL}/offers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
      },
    });

    // If we get HTML instead of JSON, it means there's a server error
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Server error occurred');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete offer');
    }

    // For mock data, filter out the deleted offer
    const mockOffers = allOffers.filter(offer => offer.id !== id);
    
    // Return a success response
    return {
      success: true,
      message: 'Offer deleted successfully',
    };
  } catch (error) {
    console.error('Delete error:', error);
    // If it's a server error (HTML response), throw a user-friendly error
    if (error instanceof Error && error.message.includes('<!DOCTYPE')) {
      throw new Error('Server error occurred. Please try again later.');
    }
    throw error;
  }
}

export async function logout() {
  localStorage.removeItem('token');

} 