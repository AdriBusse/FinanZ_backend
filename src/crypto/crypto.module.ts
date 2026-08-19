import { Module } from "@nestjs/common";
import { CoinGeckoApiService } from "./services/coingecko-api.service";
import { CryptoResolver } from "./resolvers/crypto.resolver";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  providers: [CoinGeckoApiService, CryptoResolver],
  exports: [CoinGeckoApiService],
})
export class CryptoModule {}
