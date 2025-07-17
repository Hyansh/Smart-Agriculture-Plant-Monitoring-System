import plotly.graph_objects as go
import plotly.express as px
import json

# Parse the provided data
data_json = {
    "comparison": [
        {"metric": "Water Usage Efficiency", "smart_agriculture": 75, "traditional_farming": 45},
        {"metric": "Crop Yield Improvement", "smart_agriculture": 85, "traditional_farming": 60},
        {"metric": "Labor Cost Reduction", "smart_agriculture": 40, "traditional_farming": 80},
        {"metric": "Fertilizer Efficiency", "smart_agriculture": 80, "traditional_farming": 50},
        {"metric": "Disease Detection Speed", "smart_agriculture": 95, "traditional_farming": 30},
        {"metric": "Resource Monitoring", "smart_agriculture": 90, "traditional_farming": 25},
        {"metric": "Data-driven Decisions", "smart_agriculture": 88, "traditional_farming": 20}
    ]
}

# Extract data and create abbreviated metric names (under 15 chars)
metrics = []
smart_values = []
traditional_values = []

metric_abbreviations = {
    "Water Usage Efficiency": "Water Usage",
    "Crop Yield Improvement": "Crop Yield",
    "Labor Cost Reduction": "Labor Cost",
    "Fertilizer Efficiency": "Fertilizer", 
    "Disease Detection Speed": "Disease Detect",
    "Resource Monitoring": "Resource Mon",
    "Data-driven Decisions": "Data Decisions"
}

for item in data_json["comparison"]:
    metrics.append(metric_abbreviations[item["metric"]])
    smart_values.append(item["smart_agriculture"])
    traditional_values.append(item["traditional_farming"])

# Create horizontal bar chart
fig = go.Figure()

# Add Traditional Farming bars (orange)
fig.add_trace(go.Bar(
    y=metrics,
    x=traditional_values,
    name='Traditional',
    orientation='h',
    marker_color='#FFC185'
))

# Add Smart Agriculture bars (green - using cyan as the more visible green option)
fig.add_trace(go.Bar(
    y=metrics,
    x=smart_values,
    name='Smart Agri',
    orientation='h',
    marker_color='#5D878F'
))

# Update layout
fig.update_layout(
    title='Smart Agriculture vs Traditional Farming',
    xaxis_title='Percentage (%)',
    yaxis_title='Metrics',
    barmode='group',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Save the chart
fig.write_image('agriculture_comparison.png')
fig.show()