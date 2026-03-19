import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { env } from '../config/env';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = env.apiBaseUrl;

  getHealth() {
    return this.http.get<{ ok: boolean }>(`${this.baseUrl}/health`);
  }

  getOrganizations() {
    return this.http.get<Organization[]>(`${this.baseUrl}/organizations`);
  }

  getOrganization(id: string) {
    return this.http.get<Organization & { clients: Client[] }>(`${this.baseUrl}/organizations/${id}`);
  }

  createOrganization(body: OrganizationCreateDto) {
    return this.http.post<Organization>(`${this.baseUrl}/organizations`, body);
  }

  updateOrganization(id: string, body: OrganizationUpdateDto) {
    return this.http.patch<Organization>(`${this.baseUrl}/organizations/${id}`, body);
  }

  deleteOrganization(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/organizations/${id}`);
  }

  getClients(organizationId?: string) {
    const url = `${this.baseUrl}/clients`;
    return organizationId
      ? this.http.get<Client[]>(url, { params: { organizationId } })
      : this.http.get<Client[]>(url);
  }

  getClient(id: string) {
    return this.http.get<Client>(`${this.baseUrl}/clients/${id}`);
  }

  createClient(body: ClientCreateDto) {
    return this.http.post<Client>(`${this.baseUrl}/clients`, body);
  }

  updateClient(id: string, body: ClientUpdateDto) {
    return this.http.patch<Client>(`${this.baseUrl}/clients/${id}`, body);
  }

  deleteClient(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/clients/${id}`);
  }
}

export interface Organization {
  id: string;
  name: string;
  fullName?: string | null;
  shortName?: string | null;
  inn?: string | null;
  kpp?: string | null;
  ogrn?: string | null;
  okpo?: string | null;
  okved?: string | null;
  legalAddress?: string | null;
  actualAddress?: string | null;
  postalAddress?: string | null;
  bankName?: string | null;
  bik?: string | null;
  settlementAccount?: string | null;
  correspondentAccount?: string | null;
  phone?: string | null;
  extraPhone?: string | null;
  email?: string | null;
  website?: string | null;
  directorFio?: string | null;
  directorFioShort?: string | null;
  directorPosition?: string | null;
  directorActingOn?: string | null;
  fssNumber?: string | null;
  pfrNumber?: string | null;
  logoUrl?: string | null;
  signatureUrl?: string | null;
  stampUrl?: string | null;
  notes?: string | null;
  markup?: number | null;
  prefix?: string | null;
  vatPercent?: number | null;
  accentColor?: string | null;
  requisites?: string | null;
  createdAt: string;
  updatedAt: string;

  _count?: { clients: number };
  clients?: Client[];
}

export interface Client {
  id: string;
  name: string;
  organizationId: string;
  inn?: string | null;
  kpp?: string | null;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  requisites?: string | null;
  address?: string | null;
  notes?: string | null;
  discount?: number | null;
  clientMarkup?: number | null;
  createdAt: string;
  updatedAt: string;
  organization?: { id: string; name: string };
}

// Frontend minimal DTOs for current UI step (add only name + ids)
export type OrganizationCreateDto = Pick<Organization, 'name'>;
export type OrganizationUpdateDto = Partial<OrganizationCreateDto>;

export type ClientCreateDto = Pick<Client, 'name' | 'organizationId'>;
export type ClientUpdateDto = Partial<ClientCreateDto>;

