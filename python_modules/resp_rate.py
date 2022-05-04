import neurokit2 as nk
import sys
import json
from statistics import median
import pandas as pd
import numpy as np

# Read data from the Writable Stream
def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

def main():
    # Store the data as an array in 'data_input'
    data_input = read_in()
   # data_in = nk.data("bio_eventrelated_100hz")
    # get sample_rate from argument
    # data_in = pd.read_csv("./sensor/WESAD/S3/respiban40000.csv")
    # data_input = data_in["RSP"]

    sample_rate = int(sys.argv[1])

    cleaned = nk.rsp_clean(data_input, sampling_rate=sample_rate)
    #   Extract peaks
    df, peaks_dict = nk.rsp_peaks(cleaned, sampling_rate=sample_rate)
    # Extract rate
    rsp_rate = sample_rate / median(np.diff(peaks_dict["RSP_Peaks"])) * 60
    

    sys.stdout.write(str(rsp_rate))

    # rsp_rate = nk.rsp_rate(cleaned, peaks_dict, sampling_rate=sample_rate)


    # output, info = nk.rsp_process(cleaned, sampling_rate=sample_rate)
    # # # Extract rate
    # sys.stdout.write(str(median(rsp_rate)))
    # print('\n')
    # sys.stdout.write(str(median(output["RSP_Rate"])))

# Start the process
if __name__ == '__main__':
    main()
