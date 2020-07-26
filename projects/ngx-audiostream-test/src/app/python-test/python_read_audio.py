import scipy.io.wavfile as wavf
import numpy as np


def to_wav(data):
    isInt16 = True  # Int16 ou Float32 ?
    fs = 16000  # 44100 ou 16000 ?
    out_f = 'out.wav'
    if isInt16:
        wavf.write(out_f, fs, np.float32(np.array(data)/32767))
    else:
        wavf.write(out_f, fs, np.array(data))
