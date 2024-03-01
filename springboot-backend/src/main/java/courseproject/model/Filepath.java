package courseproject.model;



@RedisHash("filepath")
@Data
@NoArgsConstructor
public class Filepath implements Serializable {

    @Id
    private String id;

    @JsonIgnore
    private String path;

    private String name;
}