package courseproject.springbootbackend.utility;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PathsUtils {
    public static final String WEBAPP_PATH = "/api-v1/";

    public static final String PATIENTS_PATH = "/api-v1/patients";

    public static final String DOCTORS_PATH = "/api-v1/doctors";

    public static final String JOURNALS_PATH = "/api-v1/journals";

    public static final String FILES_PATH = "/api-v1/files";

    public static final String PRICES_PATH = "/api-v1/prices";

    public static final String AGENCIES_PATH = "/api-v1/agencies";

    public static final String AGREEMENTS_PATH = "/api-v1/agreements";

    public static final String TREATMENTS_PATH = "/api-v1/treatments";

    public static final String SIGNUP_PATH = "/signup";
}