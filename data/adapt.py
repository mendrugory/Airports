# -*- coding: utf-8 -*-
import json
import csv


PATH = "airports.dat"
OUT = "airports.json"

def make_register(headers, line):
    register = {}
    latlon = {}
    for header, data in zip(headers, line):
        header = header.lower()
        if header in ["lat", "lon"]:
            latlon[header] = float(data)
        else:
            if header in ["altitude", "timezone"]:
                data = float(data)
            elif header in ["id"]:
                data = int(data)
            register[header] = data
    location = []
    location.append(latlon["lon"])
    location.append(latlon["lat"])

    loc = {}
    loc["type"] = "Point"
    loc["coordinates"] = location

    register["loc"] = loc
    return register

def write_registers(registers):
    with open(OUT, "w") as f:
        for register in registers:
            f.write(json.dumps(register))
            f.write("\n")

print "Working ..."
with open(PATH) as f:
    airports = []
    spamreader = csv.reader(f, delimiter=",")
    headers = spamreader.next()
    for line in spamreader:
        airports.append(make_register(headers, line))
    write_registers(airports)
print "THE END"
