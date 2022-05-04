import neurokit2 as nk
import sys
import json
import numpy as np
from statistics import median
# Read data from the Writable Stream
def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])


def main():
    # Store the data as an array in 'data_input'
    data_input = read_in()
    # get sample_rate from argument
    sample_rate = int(sys.argv[1])

    cleaned = nk.ecg_clean(data_input, sampling_rate=sample_rate)
    
    df, peaks_dict = nk.ecg_peaks(cleaned, sampling_rate=sample_rate)
  #  print(peaks_dict)
    # Extract rate
    ecg_rate = sample_rate / median(np.diff(peaks_dict["ECG_R_Peaks"])) * 60
    

    sys.stdout.write(str(ecg_rate))


# Start the process
if __name__ == '__main__':
    main()


