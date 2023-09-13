package courseproject.controller;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import courseproject.model.Treatment;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RequestAddPriceForJournal {
    Treatment treatment;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    Date date;
}
