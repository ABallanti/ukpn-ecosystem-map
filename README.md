# UKPN Data Ecosystem Map Visualisation

This repository holds code which creates the visualisation of the UKPN internal data ecosystem map.

At this stage, the visualisation is a prototype, containing sample data to enable exploration of the dataset and to decide on structures.

## Data Files

The repository contains a series of test files:

* `ecosystem.csv`: sample data provided by UKPN. Levels of the map are presented as discrete columns, which is not suitable to populate the visualisation directly.
* `entities.csv` / `connections.csv`: CSV files which can be imported into Kumu. An early experiment in using an 'off the peg' solution.
* `ecosystem-tree.csv`: A tree structured file presenting the same ecosystem, but capturing instead a parent-child relationship. This requires a single root node, which is termed UKPN.