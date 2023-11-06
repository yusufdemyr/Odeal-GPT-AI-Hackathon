import pandas as pd

data = pd.read_csv("Segmentasyon/hackathon_data_final.csv")

data = data[data["UyeDurum"]=="Aktif"]

for i in data["Müşteri Numarası"].unique():
    data[data["Müşteri Numarası"]==i].drop("UyeDurum",axis=1).to_csv("Chatbot/api/aktif_user/{}.csv".format(i),index=False)