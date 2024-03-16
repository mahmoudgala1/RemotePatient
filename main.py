import joblib
import sys
filename = "./Logistic model.joblib" 
loaded_model = joblib.load(filename)
data=[float(arg) for arg in sys.argv[1:]]
Ypredict = loaded_model.predict([data])
print(Ypredict)