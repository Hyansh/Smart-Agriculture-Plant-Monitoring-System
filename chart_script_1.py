import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import json

# Parse the provided data
data = {"workflow": [{"section": "Field Monitoring", "color": "#4CAF50", "components": ["Soil Moisture & pH Sensors", "Temperature & Humidity Sensors", "Weather Station", "NPK Sensors"]}, {"section": "Data Processing", "color": "#2196F3", "components": ["WiFi/LoRa Communication", "Edge Computing", "Cloud Analytics", "Machine Learning"]}, {"section": "User Control", "color": "#FF9800", "components": ["Mobile App Interface", "Auto/Manual Mode Selection", "Irrigation Control", "Real-time Monitoring"]}]}

# Create the figure
fig = go.Figure()

# Define positions and colors from the data
section_colors = [section["color"] for section in data["workflow"]]
y_positions = [3, 2, 1]  # Top to bottom

# Add components for each section
for i, section in enumerate(data["workflow"]):
    components = section["components"]
    section_name = section["section"]
    
    # Abbreviate components to fit 15 character limit
    abbrev_components = []
    for comp in components:
        if len(comp) <= 15:
            abbrev_components.append(comp)
        else:
            # Smart abbreviation
            if "Sensors" in comp:
                abbrev_components.append(comp.replace("Sensors", "Sen").replace(" & ", "&")[:15])
            elif "Communication" in comp:
                abbrev_components.append(comp.replace("Communication", "Comm")[:15])
            elif "Interface" in comp:
                abbrev_components.append(comp.replace("Interface", "UI")[:15])
            elif "Selection" in comp:
                abbrev_components.append(comp.replace("Selection", "Select")[:15])
            elif "Monitoring" in comp:
                abbrev_components.append(comp.replace("Monitoring", "Monitor")[:15])
            else:
                abbrev_components.append(comp[:15])
    
    # Add boxes for each component
    for j, comp in enumerate(abbrev_components):
        fig.add_trace(go.Scatter(
            x=[j + 1],
            y=[y_positions[i]],
            mode='markers+text',
            text=comp,
            textposition='middle center',
            textfont=dict(size=10, color='white'),
            marker=dict(
                size=100,
                color=section_colors[i],
                symbol='square',
                line=dict(width=2, color='white')
            ),
            name=section_name if j == 0 else "",
            showlegend=True if j == 0 else False,
            cliponaxis=False,
            hovertemplate=f"<b>{section_name}</b><br>{comp}<extra></extra>"
        ))

# Add prominent arrows between sections
arrow_props = dict(
    arrowhead=2,
    arrowsize=2,
    arrowwidth=3,
    arrowcolor="gray"
)

# Arrow from Field Monitoring to Data Processing
fig.add_annotation(
    x=2.5, y=2.7,
    ax=2.5, ay=2.3,
    arrowhead=3,
    arrowsize=2,
    arrowwidth=4,
    arrowcolor="gray",
    showarrow=True,
    text="",
    axref="x", ayref="y"
)

# Arrow from Data Processing to User Control
fig.add_annotation(
    x=2.5, y=1.7,
    ax=2.5, ay=1.3,
    arrowhead=3,
    arrowsize=2,
    arrowwidth=4,
    arrowcolor="gray",
    showarrow=True,
    text="",
    axref="x", ayref="y"
)

# Add system info annotations
fig.add_annotation(
    x=0.5, y=3.5,
    text="1 Acre Coverage",
    showarrow=False,
    font=dict(size=12, color="black"),
    bgcolor="rgba(255,255,255,0.8)",
    bordercolor="black",
    borderwidth=1
)

fig.add_annotation(
    x=4.5, y=0.5,
    text="Auto/Manual Mode",
    showarrow=False,
    font=dict(size=12, color="black"),
    bgcolor="rgba(255,255,255,0.8)",
    bordercolor="black",
    borderwidth=1
)

# Update layout
fig.update_layout(
    title='Smart Agriculture System',
    xaxis_title='',
    yaxis_title='',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    showlegend=True
)

# Update axes
fig.update_xaxes(showgrid=False, showticklabels=False, range=[0, 5])
fig.update_yaxes(showgrid=False, showticklabels=False, range=[0, 4])

# Save the chart
fig.write_image('smart_agriculture_workflow.png')