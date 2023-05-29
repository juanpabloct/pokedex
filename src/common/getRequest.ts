import { BadRequestException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

export class getRequest {
  private axios: AxiosInstance = axios;
  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get(url);
      return data;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async post<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get(url);
      return data;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async put<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get(url);
      return data;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get(url);
      return data;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
