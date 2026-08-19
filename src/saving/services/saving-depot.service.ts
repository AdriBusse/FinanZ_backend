import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SavingDepot } from "../entities/saving-depot.entity";
import { User } from "../../user/entities/user.entity";

@Injectable()
export class SavingDepotService {
  constructor(
    @InjectRepository(SavingDepot)
    private readonly depotRepository: Repository<SavingDepot>
  ) {}

  async getSavingDepots(user: User): Promise<SavingDepot[]> {
    return this.depotRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async getSavingDepot(id: number | string, user: User): Promise<SavingDepot> {
    const depot = await this.depotRepository.findOne({
      where: { id: Number(id), user: { id: user.id } },
    });
    if (!depot) {
      throw new NotFoundException("Cannot find Saving Depot!");
    }
    return depot;
  }

  async createSavingDepot(
    name: string,
    short: string,
    currency: string | undefined,
    savinggoal: number | null | undefined,
    user: User
  ): Promise<SavingDepot> {
    const newDepot = this.depotRepository.create({
      name,
      short,
      currency: currency || "€",
      savinggoal: savinggoal !== undefined ? savinggoal : null,
      user,
    });

    return this.depotRepository.save(newDepot);
  }

  async updateSavingDepot(
    id: number | string,
    name?: string,
    short?: string,
    currency?: string,
    savinggoal?: number | null,
    user?: User
  ): Promise<SavingDepot> {
    const depot = await this.depotRepository.findOne({
      where: { id: Number(id), user: { id: user?.id } },
    });
    if (!depot) {
      throw new NotFoundException("Cannot find Saving Depot!");
    }

    if (name !== undefined) depot.name = name;
    if (short !== undefined) depot.short = short;
    if (currency !== undefined) depot.currency = currency;
    if (savinggoal !== undefined) depot.savinggoal = savinggoal;

    return this.depotRepository.save(depot);
  }

  async deleteSavingDepot(id: number | string, user: User): Promise<boolean> {
    const depot = await this.depotRepository.findOne({
      where: { id: Number(id), user: { id: user.id } },
    });
    if (!depot) {
      throw new NotFoundException("Cannot find Saving Depot!");
    }

    await this.depotRepository.delete({ id: Number(id) });
    return true;
  }
}
