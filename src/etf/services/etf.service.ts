import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ETF } from "../entities/etf.entity";
import { User } from "../../user/entities/user.entity";
import { LemonApiService } from "./lemon-api.service";
import { ETFSearch } from "../types/etf-search.type";

@Injectable()
export class EtfService {
  constructor(
    @InjectRepository(ETF)
    private readonly etfRepository: Repository<ETF>,
    private readonly lemonApiService: LemonApiService
  ) {}

  async getETFs(user: User): Promise<ETF[]> {
    return this.etfRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async getETF(id: number | string, user: User): Promise<ETF> {
    const etf = await this.etfRepository.findOne({
      where: { id: Number(id), user: { id: user.id } },
    });
    if (!etf) {
      throw new NotFoundException("ETF not found");
    }
    return etf;
  }

  async searchETF(searchKey: string): Promise<ETFSearch> {
    const result = await this.lemonApiService.searchETF(searchKey);
    return new ETFSearch(result);
  }

  async createETF(isin: string, user: User): Promise<ETF> {
    const searchETF = await this.lemonApiService.searchETF(isin);
    if (!searchETF) {
      throw new BadRequestException("Something went wrong while creating the ETF");
    }

    const etf = this.etfRepository.create({
      name: searchETF.name,
      title: searchETF.title,
      symbol: searchETF.symbol,
      isin: searchETF.isin,
      wkn: searchETF.wkn,
      user,
    });

    return this.etfRepository.save(etf);
  }

  async deleteETF(id: number | string, user: User): Promise<boolean> {
    const etf = await this.etfRepository.findOne({
      where: { id: Number(id), user: { id: user.id } },
    });
    if (!etf) {
      throw new NotFoundException("ETF not found");
    }

    await this.etfRepository.delete({ id: Number(id) });
    return true;
  }
}
