'''
Input: list of 5 csv file names
Output: json 5*5 table

{
    "columns": ["RMSD", "Some Score", "C", "D", "E"],
    "index": ["Ligand1", "Ligand2", "Ligand3", "Ligand4", "Ligand5"],
    "data": [
        [0.5, 0.8, 1.2, 0.9, 1.0],
        [0.6, 0.7, 1.1, 0.8, 0.9],
        [0.4, 0.9, 1.3, 1.0, 1.2],
        [0.7, 0.6, 1.0, 0.7, 0.8],
        [0.5, 0.8, 1.2, 0.9, 1.0]
    ]
}

'''

import pandas as pd
import glob
import os
import json

def placers_to_heatmap(folder_path):

    return tb.to_json(orient = 'split')