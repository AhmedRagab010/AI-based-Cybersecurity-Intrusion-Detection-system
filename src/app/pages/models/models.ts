import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ModelDetailsComponent } from '../model-details/model-details';
import { DataService } from '../../services/data';
import { ModelInfo } from '../../models/models';

@Component({
  selector: 'app-models',
  imports: [CommonModule, NgChartsModule, ModelDetailsComponent],
  templateUrl: './models.html',
  styleUrls: ['./models.css']
})
export class Models implements OnInit {
  models: ModelInfo[] = [];
  selectedModel: string = '';
  selectedModelForDetails: ModelInfo | null = null;
  toastMessage: string = '';
  showToast: boolean = false;

  constructor(private ds: DataService) {}

  ngOnInit() {
    // Load last selected model from localStorage
    const lastModel = localStorage.getItem('lastSelectedModel');
    if (lastModel && lastModel !== 'undefined' && lastModel !== '') {
      this.selectedModel = lastModel;
    }
    this.refreshModels();
  }

  private refreshModels() {
    this.ds.getModelBenchmarks().subscribe(list => {
      // Update all models to not be preferred first
      this.models = list.map(m => ({ ...m, preferred: false }));
      
      // Find the currently selected model and mark it as preferred
      const currentModel = this.models.find(m => m.name === this.selectedModel);
      if (currentModel) {
        currentModel.preferred = true;
      } else if (this.models.length > 0) {
        // Default to first model if none selected
        this.models[0].preferred = true;
        this.selectedModel = this.models[0].name;
        localStorage.setItem('lastSelectedModel', this.models[0].name);
      }
    });
  }

  setAsPreferred(model: ModelInfo) {
    // Update local state immediately for better UX
    this.models = this.models.map(m => ({
      ...m,
      preferred: m.name === model.name
    }));
    this.selectedModel = model.name;
    
    // Save to localStorage
    localStorage.setItem('lastSelectedModel', model.name);
    
    // Save to backend
    this.ds.saveSettings({ selectedModel: model.name }).subscribe(() => {
      this.showSuccessToast(`✓ ${model.name} is now your preferred model`);
      // Refresh to ensure sync with backend
      setTimeout(() => this.refreshModels(), 500);
    }, error => {
      console.error('Failed to save model preference', error);
      this.showSuccessToast(`✗ Failed to set ${model.name} as preferred`);
    });
  }

  private showSuccessToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  getChartData(model: ModelInfo) {
    return {
      labels: ['Accuracy', 'Precision', 'Recall'],
      datasets: [
        {
          data: [model.accuracy, model.precision, model.recall],
          backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981']
        }
      ]
    };
  }

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 100 } }
  };

  showDetails(model: ModelInfo) {
    this.selectedModelForDetails = model;
  }
}
