import java.util.Random;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.JSONObject;

import java.io.*;
import java.util.*;
import java.text.*;


/**
 * "date_transacted": "2023-11-25",
 * "date_posted": "2023-11-26",
 * "amount": 888,
 * "description": "morningstar",
 * "currency": "USD"
 */
public class CreditCardUser {
    static org.json.simple.JSONObject config;
    static String merchants[] = {
            "24 hour fitness", "Arby's", "Hilton", "Amazon", "United", "Wal-Mart",
            "Safeway", "GameStop", "Macy's", "Wall Street Journal", "Starbuck's", "Pizza My Heart",
            "Happy Cafe", "TOGO's", "KFC", "Expensive Shoe Store", "Coach", "Oil Changer",
            "AAA Travel", "Hobby Store", "Financial Times", "Uber", "WEE INC", "BENTO EXPRESS",
            "Kate's Nail Salon", "Happy Spa" , "Discord", "SteamGames", "Blizzard", "Spotify",
            "THE SMOKE DEN", "BAR BLISS", "Disney", "GameHive.com", "PlaySphere",
            "Happy House Keepers", "A+ Plumbing Experts", "GoldenHarbor Traders", "Den's Diver",
            "Whole Foods", "Lush Marketplace"};

    static JSONArray generateTransactionList(String date, int count) {
        JSONArray retVal = new JSONArray();
        while (count > 0) {
            Random r = new Random();
            int idx = r.nextInt(merchants.length);
            JSONObject o = new JSONObject();
            o.put("date_posted", date);
            o.put("date_transacted", date);
            o.put("description", merchants[idx]);
            o.put("currency", "USD");
            o.put("amount", r.nextInt(1000));
            retVal.add(o);
            count--;
        }
        return retVal;
    }

    static JSONObject createPlaidConfigForChecking() throws Exception {
        JSONObject retVal = new JSONObject();
        retVal.put("type", "depository");
        retVal.put("subtype", "checking");
        JSONArray names = new JSONArray();
        names.add(config.get("name"));
        JSONObject namesO = new JSONObject();
        namesO.put("names", names);
        retVal.put("identity", namesO);
        addTransactions(retVal);
        return retVal;

    }


    static JSONObject createPlaidConfigForCredit() throws Exception {
                JSONObject retVal = new JSONObject();
        retVal.put("type", "credit");
        retVal.put("subtype", "credit card");
        JSONArray names = new JSONArray();
        names.add(config.get("name"));
        JSONObject namesO = new JSONObject();
        namesO.put("names", names);
        retVal.put("identity", namesO);
        addTransactions(retVal);
        return retVal;
    }

    static void addTransactions(JSONObject retVal) throws Exception {
        long daysCount = (Long) config.get("days");
        String day = (String) config.get("start_day");
        long count = (Long) config.get("transaction_count");
        JSONArray total = new JSONArray();
        SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
        Date currentD = f.parse(day);
        Calendar cal = Calendar.getInstance();
        while (daysCount > 0) {
            JSONArray transactionList = generateTransactionList(day, (int) count);
            total.addAll(transactionList);
            daysCount--;
            cal.setTime(currentD);
            cal.add(Calendar.DATE, 1);
            currentD = cal.getTime();
            day = f.format(currentD);
        }

        retVal.put("transactions", total);
    }


    public static void main(String[] argv) throws Exception {
        String filePath = argv[0];

        JSONParser parser = new JSONParser();
        Reader reader = new FileReader(filePath);
        Object jsonObj = parser.parse(reader);
        config = (org.json.simple.JSONObject) jsonObj;
        //
        // System.out.println(config.get("name"));
        JSONObject out = new JSONObject();
        JSONArray accounts = new JSONArray();
        JSONArray typesList = (JSONArray) config.get("types");
        Iterator it = typesList.iterator();
        while (it.hasNext()) {
            String type = (String) it.next();
            if (type.equalsIgnoreCase("credit")) {
                JSONObject creditO = createPlaidConfigForCredit();
                accounts.add(creditO);
            }
            if (type.equalsIgnoreCase("checking")) {
                JSONObject checkingO = createPlaidConfigForChecking();
                accounts.add(checkingO);
            }
        }
        out.put("override_accounts", accounts);
        //System.out.println(out.toJSONString());
        String fileName = (String) config.get("out");
        BufferedWriter writer = new BufferedWriter(new FileWriter(fileName));

        writer.write(out.toString(4));
        writer.close();
    }
}
