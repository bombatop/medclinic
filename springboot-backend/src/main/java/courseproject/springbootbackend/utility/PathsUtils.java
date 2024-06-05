package courseproject.springbootbackend.utility;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PathsUtils {
    public static final String API = "/api-v1/";

    public static final String AUTH_PATH = API + "auth";

    public static final String PATIENTS_PATH = API + "patients";

    public static final String USERS_PATH = API + "users";

    public static final String JOURNALS_PATH = API + "journals";

    public static final String FILES_PATH = API + "files";

    public static final String PRICES_PATH = API + "prices";

    public static final String AGENCIES_PATH = API + "agencies";

    public static final String AGREEMENTS_PATH = API + "agreements";

    public static final String TREATMENTS_PATH = API + "treatments";
    
    public static final String DIAGNOSIS_PATH = API + "diagnoses";
    
    public static final String ROLES_PATH = API + "roles";
}