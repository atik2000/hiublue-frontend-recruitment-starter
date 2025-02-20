export interface DashboardStats {
  totalActiveUsers: number;
  totalClicks: number;
  totalAppearances: number;
  previousMonth: {
    activeUsers: number;
    clicks: number;
    appearances: number;
  };
}

export interface WebsiteVisit {
  day: string;
  desktop: number;
  mobile: number;
}

export interface OffersSent {
  day: string;
  count: number;
}

export interface OfferListItem {
  id: number;
  user_name: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  status: 'accepted' | 'rejected' | 'pending';
  type: 'yearly' | 'monthly' | 'pay_as_you_go';
  price: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface OffersResponse {
  data: OfferListItem[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface CreateOfferData {
  type: 'yearly' | 'monthly' | 'pay_as_you_go';
  user_id: number;
  expired_date: string;
  price: number;
  additions: {
    refundable: boolean;
    on_demand: boolean;
    negotiable: boolean;
  };
} 