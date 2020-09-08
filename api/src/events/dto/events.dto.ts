import { IsIn } from "class-validator";

export class GetEventsQueryDto {
  @IsIn(['1', '3', '7', '30'])
  days: string;
}