import threading
import time
import math

from satori_raspberry.skills.base import Skill as BaseSkill

DIST_MAX = 41



class Skill(BaseSkill):
    def __init__(self, gpio, client, channel):
        self.GPIO = gpio
        self.client = client
        self.channel = channel
        self.pin_trig = None
        self.pin_echo = None

    def plug(self, pin_trig, pin_echo):
        self.pin_trig = pin_trig
        self.pin_echo = pin_echo
        self.GPIO.setmode(self.GPIO.BOARD)
        self.GPIO.setup(self.pin_trig, self.GPIO.OUT)
        self.GPIO.setup(self.pin_echo, self.GPIO.IN)
        threading.Thread(target=self.get_data, args=()).start()

    def unplug(self, pin):
        self.pin_trig = None
        self.pin_echo = None

    def get_data(self):
        while self.pin_trig:
            self.GPIO.output(self.pin_trig, 0)
            time.sleep(0.000002)

            self.GPIO.output(self.pin_trig, 1)
            time.sleep(0.00001)
            self.GPIO.output(self.pin_trig, 0)

            while self.GPIO.input(self.pin_echo) == 0:
                a = 0
            time1 = time.time()

            while self.GPIO.input(self.pin_echo) == 1:
                a = 1
            time2 = time.time()

            during = time2 - time1
            dist = during * 340 / 2 * 100
            if dist < DIST_MAX + 3:
                delta = 0
                ratio = int(math.ceil((DIST_MAX - dist + delta) / (DIST_MAX) * 100))
                message = {
                    "id": "trashcan001",
                    "type": "trashcan",
                    "category": "trash",
                    "volume": max(0, min(100, ratio)),
                    "severity": "medium",
                }
                self.send_response(message)
            else:
                print("Out of Range: {0}".format(dist))



            time.sleep(0.5)
