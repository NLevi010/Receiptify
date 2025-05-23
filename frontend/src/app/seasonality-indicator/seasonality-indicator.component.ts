import {Component, Input} from '@angular/core';
import {IngredientSeasonality, RecipeSeasonality} from "../../shared/models/seasonality.model";

@Component({
  selector: 'app-seasonality-indicator',
  templateUrl: './seasonality-indicator.component.html',
  styleUrl: './seasonality-indicator.component.scss'
})
export class SeasonalityIndicatorComponent {
  @Input() seasonalityInfo: RecipeSeasonality | null = null;
  @Input() showDetails = false;

  showAllIngredients = false;

  toggleDetailsView(): void {
    this.showAllIngredients = !this.showAllIngredients;
  }

  getScoreClass(): string {
    if (!this.seasonalityInfo) return 'score-unknown';

    const score = this.seasonalityInfo.seasonalScore;

    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    if (score >= 40) return 'score-low';
    return 'score-very-low';
  }

  getScoreText(): string {
    if (!this.seasonalityInfo) return 'Unknown';

    // Get the score and evaluate if it's all year-round ingredients
    const score = this.seasonalityInfo.seasonalScore;
    const isAllYearRound = this.seasonalityInfo.yearRoundCount > 0 &&
      this.seasonalityInfo.yearRoundCount ===
      (this.seasonalityInfo.inSeasonCount + this.seasonalityInfo.outOfSeasonCount);

    // Adjust text based on year-round status
    if (isAllYearRound) {
      return 'Year-Round';
    } else if (score >= 80) {
      return 'Highly Seasonal';
    } else if (score >= 60) {
      return 'Mostly Seasonal';
    } else if (score >= 40) {
      return 'Partially Seasonal';
    } else if (score >= 20) {
      return 'Minimally Seasonal';
    }
    return 'Not Seasonal';
  }

  getStatusIcon(status: IngredientSeasonality): string {
    if (status.isInSeason) return 'bi-check-circle-fill text-success';
    if (status.isComingSoon) return 'bi-clock-history text-warning';
    return 'bi-x-circle-fill text-danger';
  }

  getStatusTooltip(status: IngredientSeasonality): string {
    return status.status;
  }
}


