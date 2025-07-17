import plotly.graph_objects as go
import plotly.express as px
import numpy as np
import pandas as pd

# Define the components with shortened names (15 char limit) and descriptions
components_data = [
    {"name": "Soil Monitor", "full_name": "Real-time Soil Monitoring", "desc": "Moisture, pH, nutrients"},
    {"name": "Weather Mon", "full_name": "Weather Monitoring", "desc": "Temperature, humidity, rainfall"},
    {"name": "Mobile App", "full_name": "Mobile App Control", "desc": "iOS/Android interface"},
    {"name": "Auto Irrigation", "full_name": "Automated Irrigation", "desc": "Water pumps, valves"},
    {"name": "Manual/Auto", "full_name": "Manual/Auto Mode", "desc": "User control options"},
    {"name": "Data Analytics", "full_name": "Data Analytics", "desc": "Insights & alerts"},
    {"name": "1 Acre Cover", "full_name": "1 Acre Coverage", "desc": "Field monitoring area"},
    {"name": "Cloud Storage", "full_name": "Cloud Storage", "desc": "Data backup & sync"}
]

# Brand colors in order
colors = [
    "#1FB8CD",  # Strong cyan
    "#FFC185",  # Light orange
    "#ECEBD5",  # Light green
    "#5D878F",  # Cyan
    "#D2BA4C",  # Moderate yellow
    "#B4413C",  # Moderate red
    "#964325",  # Dark orange
    "#944454"   # Pink-red
]

# Calculate positions for components in a circle
n_components = len(components_data)
angles = np.linspace(0, 2*np.pi, n_components, endpoint=False)
radius = 3.5

# Component positions
x_components = radius * np.cos(angles)
y_components = radius * np.sin(angles)

# Central hub position
x_center, y_center = 0, 0

# Create the figure
fig = go.Figure()

# Add lines connecting components to center
for i in range(n_components):
    fig.add_trace(go.Scatter(
        x=[x_center, x_components[i]],
        y=[y_center, y_components[i]],
        mode='lines',
        line=dict(color='#13343B', width=2),
        showlegend=False,
        hoverinfo='skip'
    ))

# Add component circles
for i, (component, color) in enumerate(zip(components_data, colors)):
    fig.add_trace(go.Scatter(
        x=[x_components[i]],
        y=[y_components[i]],
        mode='markers+text',
        marker=dict(
            size=80,
            color=color,
            line=dict(width=3, color='white')
        ),
        text=component["name"],
        textposition='middle center',
        textfont=dict(size=12, color='black', family='Arial Black'),
        name=component["full_name"],
        showlegend=False,
        hoverinfo='text',
        hovertext=f"{component['full_name']}<br>{component['desc']}"
    ))

# Add central hub
fig.add_trace(go.Scatter(
    x=[x_center],
    y=[y_center],
    mode='markers+text',
    marker=dict(
        size=100,
        color='#13343B',
        line=dict(width=4, color='white')
    ),
    text='Plant Monitor<br>System',
    textposition='middle center',
    textfont=dict(size=13, color='white', family='Arial Black'),
    showlegend=False,
    hoverinfo='text',
    hovertext='Plant Monitoring System Hub'
))

# Update layout
fig.update_layout(
    title='Plant Monitoring System',
    showlegend=False,
    xaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[-5, 5]
    ),
    yaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[-5, 5],
        scaleanchor="x",
        scaleratio=1
    ),
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)'
)

# Save the chart
fig.write_image('plant_monitoring_system.png')
fig.show()