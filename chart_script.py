import plotly.graph_objects as go
import numpy as np

# Brand colors for the 5 layers
brand_colors = ["#1FB8CD", "#FFC185", "#ECEBD5", "#5D878F", "#D2BA4C"]

# Layer data with shortened names (<=15 chars)
layers = [
    {"name": "Field Sensors", "components": ["Soil Moisture", "Temperature", "Humidity", "pH Sensor", "NPK Sensor", "Weather Stn"], "color": brand_colors[0]},
    {"name": "Communication", "components": ["WiFi Module", "LoRa Module", "GSM Module", "Gateway"], "color": brand_colors[1]},
    {"name": "Processing", "components": ["Edge Compute", "Cloud Server", "Data Analytic", "ML Models"], "color": brand_colors[2]},
    {"name": "Application", "components": ["Mobile App", "Web Dashboard", "User Interface", "Monitor Sys"], "color": brand_colors[3]},
    {"name": "Control", "components": ["Irrigation", "Water Pumps", "Actuators", "Alert System"], "color": brand_colors[4]}
]

# Create network diagram with proper positioning
fig = go.Figure()

# Position nodes in layers (left to right)
x_positions = [0, 1, 2, 3, 4]  # x position for each layer
y_spacing = 0.2  # vertical spacing between components

# Store node positions for drawing connections
node_positions = {}

# Draw nodes for each layer
for layer_idx, layer in enumerate(layers):
    num_components = len(layer["components"])
    y_start = -(num_components - 1) * y_spacing / 2  # center the layer vertically
    
    for comp_idx, component in enumerate(layer["components"]):
        x = x_positions[layer_idx]
        y = y_start + comp_idx * y_spacing
        
        # Store position for later connection drawing
        node_positions[f"{layer_idx}_{comp_idx}"] = (x, y)
        
        # Add component node
        fig.add_trace(go.Scatter(
            x=[x], y=[y],
            mode='markers+text',
            marker=dict(size=30, color=layer["color"], line=dict(width=2, color='black')),
            text=component,
            textposition="middle center",
            textfont=dict(size=8, color='black'),
            showlegend=False,
            hovertemplate=f"<b>{layer['name']}</b><br>{component}<extra></extra>"
        ))

# Add layer labels
for layer_idx, layer in enumerate(layers):
    fig.add_trace(go.Scatter(
        x=[x_positions[layer_idx]], y=[0.8],
        mode='text',
        text=layer["name"],
        textfont=dict(size=12, color='black'),
        showlegend=False
    ))

# Draw arrows between layers to show data flow
for layer_idx in range(len(layers) - 1):
    from_layer = layers[layer_idx]
    to_layer = layers[layer_idx + 1]
    
    # Draw arrows from each component in current layer to next layer
    for from_comp_idx in range(len(from_layer["components"])):
        for to_comp_idx in range(len(to_layer["components"])):
            from_pos = node_positions[f"{layer_idx}_{from_comp_idx}"]
            to_pos = node_positions[f"{layer_idx + 1}_{to_comp_idx}"]
            
            # Draw arrow line
            fig.add_trace(go.Scatter(
                x=[from_pos[0] + 0.05, to_pos[0] - 0.05],
                y=[from_pos[1], to_pos[1]],
                mode='lines',
                line=dict(width=1, color='gray'),
                showlegend=False,
                hoverinfo='skip'
            ))
            
            # Add arrowhead
            mid_x = (from_pos[0] + to_pos[0]) / 2
            mid_y = (from_pos[1] + to_pos[1]) / 2
            fig.add_trace(go.Scatter(
                x=[mid_x], y=[mid_y],
                mode='markers',
                marker=dict(size=8, color='gray', symbol='triangle-right'),
                showlegend=False,
                hoverinfo='skip'
            ))

# Add feedback loop from Control back to Field Sensors
for control_idx in range(len(layers[4]["components"])):
    for sensor_idx in range(len(layers[0]["components"])):
        from_pos = node_positions[f"4_{control_idx}"]
        to_pos = node_positions[f"0_{sensor_idx}"]
        
        # Draw curved feedback line
        fig.add_trace(go.Scatter(
            x=[from_pos[0], from_pos[0] + 0.2, to_pos[0] - 0.2, to_pos[0]],
            y=[from_pos[1], from_pos[1] - 0.4, to_pos[1] - 0.4, to_pos[1]],
            mode='lines',
            line=dict(width=1, color='red', dash='dash'),
            showlegend=False,
            hoverinfo='skip'
        ))

# Add legend for layers
for layer_idx, layer in enumerate(layers):
    fig.add_trace(go.Scatter(
        x=[None], y=[None],
        mode='markers',
        marker=dict(size=15, color=layer["color"]),
        name=layer["name"],
        showlegend=True
    ))

# Update layout
fig.update_layout(
    title_text="Smart Agri System Architecture",
    xaxis=dict(showgrid=False, zeroline=False, showticklabels=False, range=[-0.5, 4.5]),
    yaxis=dict(showgrid=False, zeroline=False, showticklabels=False, range=[-1, 1]),
    plot_bgcolor='white',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    showlegend=True
)

fig.write_image("smart_agri_architecture.png")